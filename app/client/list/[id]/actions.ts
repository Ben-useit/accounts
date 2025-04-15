import prisma from '@/utils/db';

export type InvoiceType = {
  invoice: {
    id: number;
    name: string;
    payed: boolean;
    clientId: number | null;
  };
  data: {
    issued: {
      date: Date;
      amount: number;
    };
    payed: {
      date: Date | null;
      amount: number;
    };
  };
};

export const getInvoices = async (clientId: number): Promise<InvoiceType[]> => {
  const invoices = await prisma.invoice.findMany({
    where: {
      clientId: clientId,
    },
  });

  const result = [];
  for (const invoice of invoices) {
    const transactions = await prisma.transaction.findMany({
      where: {
        invoiceId: invoice.id,
      },
      orderBy: {
        date: 'asc',
      },
    });
    const payed: { date: Date | null; amount: number } = {
      date: null,
      amount: 0,
    };
    if (transactions.length === 0) continue;

    const { date, amount } = transactions[0];
    if (invoice?.payed) {
      if (transactions.length > 2) {
        const { date, amount } = transactions[2];
        payed.date = date;
        payed.amount = Number(amount);
      } else {
        const { date, amount } = transactions[1];
        payed.date = date;
        payed.amount = Number(amount);
      }
    }
    result.push({
      invoice: invoice,
      data: { issued: { date, amount: Number(amount) }, payed },
    });
  }
  return result;
};
