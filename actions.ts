'use server';
import prisma from '@/utils/db';
import { AccountType } from '@prisma/client';
import { setPeriod } from './prisma/queries';

export const periodSelectAction = async ({
  dateFrom,
  dateTo,
}: {
  dateFrom: string;
  dateTo: string;
}) => {
  setPeriod({ dateFrom, dateTo });
};

type BalanceType = {
  name: string;
  balance: number;
};

export const getBalances = async (
  accounttype: AccountType,
  periodStarts: Date,
  periodEnds: Date
) => {
  let total = 0;
  const balances: BalanceType[] = [];
  const result = await prisma.account.findMany({
    where: {
      type: accounttype,
    },
  });

  for (const { name } of result) {
    const balance = await getBalance(name, periodStarts, periodEnds);

    total += balance;
    balances.push({ name, balance });
  }
  return { total, balances };
};

const getBalance = async (
  name: string,
  periodStarts: Date,
  periodEnds: Date
) => {
  const debitResult = await prisma.transaction.aggregate({
    where: {
      debit: {
        name: name,
      },
      date: {
        gte: periodStarts,
        lte: periodEnds,
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
        name: name,
      },
      date: {
        gte: periodStarts,
        lte: periodEnds,
      },
    },
    _sum: {
      amount: true,
    },
  });
  const { amount: creditAmount } = creditResult._sum;
  return Number(debitAmount) - Number(creditAmount);
};
