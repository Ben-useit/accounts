import prisma from '@/utils/db';

export const getPeriod = async () => {
  const periodStart = await prisma.setting.findFirst({
    where: { name: 'periodStart' },
  });
  const periodEnd = await prisma.setting.findFirst({
    where: { name: 'periodEnd' },
  });

  if (!periodStart || !periodEnd)
    throw new Error('Configuration Error: Set Period.');

  return { periodStart: periodStart.value, periodEnd: periodEnd.value };
};

export const setPeriod = async ({
  dateFrom,
  dateTo,
}: {
  dateFrom: string;
  dateTo: string;
}) => {
  await prisma.setting.update({
    where: {
      name: 'periodStart',
    },
    data: {
      value: dateFrom,
    },
  });
  await prisma.setting.update({
    where: {
      name: 'periodEnd',
    },
    data: {
      value: dateTo,
    },
  });
};
export const getClient = async (clientId: number) => {
  const result = await prisma.client.findFirst({
    where: {
      id: clientId,
    },
  });
  return result;
};

// export const getAccounts = async ()=>{

// }

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

export const getAccounts = async () => {
  const result = await prisma.account.findMany({
    select: { id: true, name: true },
  });
  return result;
};

export const getAccount = async ({
  id,
  name,
}: {
  id?: number;
  name?: string;
}) => {
  const result = await prisma.account.findFirst({
    where: { id: id, name: name },
  });
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

export const getExpensesAccounts = async (personal = true) => {
  const domain = personal ? 'PERSONAL' : 'BUSINESS';
  const result = await prisma.account.findMany({
    where: {
      type: 'EXPENSES',
      domain: domain,
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

/**
 *
 * @param clientId
 */
export const getBalance = async (clientId: number) => {
  const result = await prisma.transaction.aggregate({
    where: {
      invoice: { clientId: clientId, payed: false },
      debit: { name: 'Receivables' },
    },
    _sum: {
      amount: true,
    },
  });
  const amount = result._sum.amount || 0;
  return Number(amount);
};
