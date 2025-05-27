import { getStartBalance } from '@/actions';
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
  let totalAmount = await getStartBalance(accountId, type, periodStart);
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
  }
  return transactionsList.reverse();
};
