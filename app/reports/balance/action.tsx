import prisma from '@/utils/db';
import { AccountType } from '@prisma/client';

type BalanceType = {
  name: string;
  balance: number;
};

export const getBalances = async (
  accounttype: AccountType,
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
    const balance = await getBalance(name, periodEnds);
    total += balance;
    balances.push({ name, balance });
  }
  return { total, balances };
};

export const getBalance = async (name: string, periodEnds: Date) => {
  const debitResult = await prisma.transaction.aggregate({
    where: {
      debit: {
        name: name,
      },
      date: {
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
