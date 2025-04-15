import prisma from '@/utils/db';

export const getBalance = async (accountId: number) => {
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
  //const amount = Number(debitAmount._sum.amount) || 0;
  return Number(debitAmount._sum.amount) - Number(creditAmount._sum.amount);
};
