import prisma from '@/utils/db';
import { AccountType } from '@prisma/client';

export const getBalance = async (accountId: number, type: AccountType) => {
  const reverse =
    type === 'EQUITY' || type === 'LIABILITIES' || type === 'INCOME';
  const debitAmount = await prisma.transaction.aggregate({
    where: {
      debitId: accountId,
    },
    _sum: {
      amount: true,
    },
  });
  const creditAmount = await prisma.transaction.aggregate({
    where: {
      creditId: accountId,
    },
    _sum: {
      amount: true,
    },
  });
  if (reverse)
    return Number(creditAmount._sum.amount) - Number(debitAmount._sum.amount);

  return Number(debitAmount._sum.amount) - Number(creditAmount._sum.amount);
};
