'use server';
import prisma from '@/utils/db';
import { AccountType, Domain } from '@prisma/client';
import { getPeriod, setPeriod } from './prisma/queries';
import { convertStringToDate } from './utils/convert';
import { calculateTax } from './utils/tax';

export const periodSelectAction = async ({
  dateFrom,
  dateTo,
}: {
  dateFrom: string;
  dateTo: string;
}) => {
  setPeriod({ dateFrom, dateTo });
};

export type BalanceType = {
  name: string;
  balance: number;
};

export const getTaxObligation = async () => {
  const period = await getPeriod();
  const periodStart = convertStringToDate(period.periodStart) as Date;
  const periodEnd = convertStringToDate(period.periodEnd) as Date;
  const { total: carExpensesGross } = await getBalances(
    { type: 'EXPENSES', group: 'Car', currency: 'MWK' },
    { periodStart, periodEnd }
  );
  const { total: carExpensesGrossEuro } = await getBalances(
    { type: 'EXPENSES', group: 'Car', currency: 'Euro' },
    { periodStart, periodEnd }
  );
  const totalCarExpenses = carExpensesGross + carExpensesGrossEuro;
  const carExpenses = Number((totalCarExpenses * 0.85).toFixed(2));
  const { total: expenses } = await getBalances(
    { type: 'EXPENSES', group: 'Business', currency: 'MWK' },
    { periodStart, periodEnd }
  );
  const { total: expensesEuro } = await getBalances(
    { type: 'EXPENSES', group: 'Business', currency: 'Euro' },
    { periodStart, periodEnd }
  );

  const totalExpenses = expenses + expensesEuro;

  const { total: income } = await getBalances(
    { type: 'INCOME', group: 'Taxable' },
    { periodStart, periodEnd }
  );
  const profit = Math.abs(income) - totalExpenses - carExpenses;
  const tax = calculateTax(profit);
  return tax;
};

export const getBalances = async (
  args: {
    name?: string;
    type?: AccountType;
    group?: string;
    domain?: Domain;
    currency?: string;
  },
  period: { periodStart: Date; periodEnd: Date }
) => {
  let total = 0;

  const balances: BalanceType[] = [];
  const result = await prisma.account.findMany({
    where: {
      name: args.name,
      type: args.type,
      group: { name: args.group },
      domain: args.domain,
      currency: { name: args.currency },
    },
  });
  //TODO remove hard coded value
  if (args.currency == 'Euro') {
    for (const { name } of result) {
      const balance = await getForexBalance(
        { name },
        { periodStart: period.periodStart, periodEnd: period.periodEnd }
      );

      total += balance;
      balances.push({ name, balance });
    }
    return { total, balances };
  } else {
    for (const { name } of result) {
      const balance = await getBalance(
        { name },
        { periodStart: period.periodStart, periodEnd: period.periodEnd }
      );

      total += balance;
      balances.push({ name, balance });
    }
    return { total, balances };
  }
};

const getForexBalance = async (
  args: { name?: string; type?: AccountType; group?: string },
  period: { periodStart: Date; periodEnd: Date }
) => {
  let debitAmount = 0;
  let creditAmount = 0;
  const debitResult = await prisma.transaction.findMany({
    where: {
      debit: {
        name: args.name,
        type: args.type,
        group: { name: args.group },
      },
      date: {
        gte: period.periodStart,
        lte: period.periodEnd,
      },
    },
  });
  debitResult.forEach(async ({ amount, rate }) => {
    if (rate) debitAmount += amount.toNumber() * rate.toNumber();
    else debitAmount += amount.toNumber();
  });

  const creditResult = await prisma.transaction.findMany({
    where: {
      credit: {
        name: args.name,
        type: args.type,
        group: { name: args.group },
      },
      date: {
        gte: period.periodStart,
        lte: period.periodEnd,
      },
    },
  });
  creditResult.forEach(async ({ amount, rate }) => {
    if (rate) creditAmount += amount.toNumber() * rate.toNumber();
    else creditAmount += amount.toNumber();
  });
  return debitAmount - creditAmount;
};

const getBalance = async (
  args: { name?: string; type?: AccountType; group?: string },
  period: { periodStart: Date; periodEnd: Date }
) => {
  const debitResult = await prisma.transaction.aggregate({
    where: {
      debit: {
        name: args.name,
        type: args.type,
        group: { name: args.group },
      },
      date: {
        gte: period.periodStart,
        lte: period.periodEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const { amount: debitAmount } = debitResult._sum;

  const creditResult = await prisma.transaction.aggregate({
    where: {
      credit: {
        name: args.name,
        type: args.type,
        group: { name: args.group },
      },
      date: {
        gte: period.periodStart,
        lte: period.periodEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const { amount: creditAmount } = creditResult._sum;
  return Number(debitAmount) - Number(creditAmount);
};
