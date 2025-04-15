'use server';
import prisma from '@/utils/db';
import { AccountType } from '@prisma/client';
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
    { type: 'EXPENSES', group: 'Car' },
    { periodStart, periodEnd }
  );
  const carExpenses = Number((carExpensesGross * 0.85).toFixed(2));
  const { total: expenses } = await getBalances(
    { type: 'EXPENSES', group: 'Business' },
    { periodStart, periodEnd }
  );
  const { total: income } = await getBalances(
    { type: 'INCOME', group: 'Taxable' },
    { periodStart, periodEnd }
  );
  const profit = Math.abs(income) - expenses - carExpenses;
  const tax = calculateTax(profit);
  return tax;
};

export const getBalances = async (
  args: { name?: string; type?: AccountType; group?: string },
  period: { periodStart: Date; periodEnd: Date }
) => {
  let total = 0;
  const balances: BalanceType[] = [];
  const result = await prisma.account.findMany({
    where: {
      name: args.name,
      type: args.type,
      group: { name: args.group },
    },
  });

  for (const { name } of result) {
    const balance = await getBalance(
      { name },
      { periodStart: period.periodStart, periodEnd: period.periodEnd }
    );

    total += balance;
    balances.push({ name, balance });
  }
  return { total, balances };
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
