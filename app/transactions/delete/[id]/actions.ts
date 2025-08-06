'use server';
import prisma from '@/utils/db';
import { AccountType, Domain } from '@prisma/client';

export const actionDelete = async (props: ResultType) => {
  const { invoice, transactions } = props;
  transactions.forEach(async ({ id }) => {
    await prisma.transaction.delete({
      where: {
        id: id,
      },
    });
  });
  if (invoice) {
    await prisma.invoice.delete({ where: { id: invoice.id } });
  }
};

export type ResultType = {
  invoice: {
    id: number;
    name: string;
    clientId: number | null;
  } | null;
  clientName: string;
  transactions: {
    debit: {
      id: number;
      description: string | null;
      name: string;
      position: number;
      type: AccountType;
      groupId: number | null;
      currencyId: number;
      domain: Domain;
    };
    credit: {
      id: number;
      description: string | null;
      name: string;
      position: number;
      type: AccountType;
      groupId: number | null;
      currencyId: number;
      domain: Domain;
    };
    id: number;
    date: Date;
    amount: number;
    debitId: number;
    creditId: number;
    description: string | null;
    invoiceId: number | null;
  }[];
};
export const getAllTransactions = async (id: string): Promise<ResultType> => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      invoice: true,
      debit: true,
      credit: true,
    },
  });
  if (!transaction) return { invoice: null, clientName: '', transactions: [] };

  if (transaction.invoiceId) {
    const invoice = transaction.invoice;
    const client = await prisma.invoice.findFirst({
      where: { id: transaction.invoiceId },
      select: {
        client: true,
      },
    });
    const clientName = client?.client?.name || '';
    const transactions = await prisma.transaction.findMany({
      where: { invoiceId: transaction.invoiceId },
      include: {
        debit: true,
        credit: true,
      },
    });

    if (transactions.length === 0)
      return { invoice, clientName, transactions: [] };

    const sortedResult = transactions.sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateA.getTime() - dateB.getTime();
    });

    const updatedTransactions = sortedResult.map((a) => {
      return {
        ...a,
        amount: a.amount.toNumber(),
      };
    });
    return { invoice, clientName, transactions: updatedTransactions };
  }

  const newTransaction = {
    id: transaction.id,
    credit: transaction.credit,
    debit: transaction.debit,
    date: transaction.date,
    amount: transaction.amount.toNumber(),
    debitId: transaction.debitId,
    creditId: transaction.creditId,
    description: transaction.description,
    invoiceId: transaction.invoiceId,
  };
  return { invoice: null, clientName: '', transactions: [newTransaction] };
};
