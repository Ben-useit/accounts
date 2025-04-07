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
  clientId: number;
};

export const transaction = async (data: TransactionType) => {
  const result = await prisma.transaction.create({ data: data });
};
