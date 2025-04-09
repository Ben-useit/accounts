import prisma from '@/utils/db';

export const getClients = async (all = false) => {
  if (all) {
    const result = await prisma.client.findMany();
    return result;
  }

  const result = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return result;
};

export const getAccount = async (name: string) => {
  const result = await prisma.account.findFirst({ where: { name: name } });
  if (!result) throw new Error(`Account ${name} does not exist`);
  return result;
};

type TransactionType = {
  date: Date;
  amount: number;
  debitId: number;
  creditId: number;
  description: string;
  invoiceId?: number;
};

type InvoiceType = {
  name: string;
  clientId: number;
};

export const transaction = async (data: TransactionType) => {
  const result = await prisma.transaction.create({ data: data });
  return result;
};

export const createInvoice = async (data: InvoiceType) => {
  const result = await prisma.invoice.create({ data });
  return result;
};

export const getInvoices = async () => {
  const result = await prisma.invoice.findMany({
    where: {
      payed: false,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return result;
};

export const getExpensesAccounts = async () => {
  const result = await prisma.account.findMany({
    where: {
      type: 'EXPENSES',
    },
    select: { id: true, name: true },
  });
  return result;
};

export const getFundsAccounts = async () => {
  const result = await prisma.account.findMany({
    where: {
      group: { name: 'Funds' },
    },
    select: { id: true, name: true },
  });
  return result;
};
