import { getPeriodAsDate } from '@/prisma/queries';
import prisma from '@/utils/db';
import { AccountType } from '@prisma/client';
/**
 * Returns all transactions for a given account.
 *
 * @param id - Account Id
 */

export type TransactionListType = {
  id: number;
  date: Date;
  description: string | null;
  debit: number;
  credit: number;
  totalAmount: number;
};

export const getTransactions = async (
  accountId: number,
  type: AccountType
): Promise<TransactionListType[]> => {
  const { periodStart, periodEnd } = await getPeriodAsDate();
  let totalAmount = await getStartBalance(accountId, periodStart);
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ creditId: accountId }, { debitId: accountId }],
      date: { gte: periodStart, lte: periodEnd },
    },
    orderBy: [{ date: 'asc' }, { id: 'asc' }],
  });

  const reverse =
    type === 'EQUITY' || type === 'LIABILITIES' || type === 'INCOME';

  const transactionsList = [];
  for (const { id, date, description, amount, debitId } of transactions) {
    if (debitId === accountId) {
      totalAmount = reverse
        ? totalAmount - Number(amount)
        : totalAmount + Number(amount);

      transactionsList.push({
        id,
        date,
        description,
        debit: Number(amount),
        credit: 0,
        totalAmount,
      });
    } else {
      totalAmount = reverse
        ? totalAmount + Number(amount)
        : totalAmount - Number(amount);
      transactionsList.push({
        id,
        date,
        description,
        debit: 0,
        credit: Number(amount),
        totalAmount,
      });
    }
    console.log('new Amount: ', totalAmount);
  }
  return transactionsList.reverse();
};

const getStartBalance = async (id: number, periodStart: Date) => {
  const credit = await prisma.transaction.aggregate({
    where: {
      creditId: id,
      date: { lt: periodStart },
    },
    _sum: { amount: true },
  });
  const creditNumber = credit._sum.amount?.toNumber() || 0;
  const debit = await prisma.transaction.aggregate({
    where: {
      debitId: id,
      date: { lt: periodStart },
    },
    _sum: { amount: true },
  });
  const debitNumber = debit._sum.amount?.toNumber() || 0;
  return debitNumber - creditNumber;
};
