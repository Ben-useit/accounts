import prisma from '@/utils/db';

/**
 *
 * @param clientId
 */
export const getInvoiceBalance = async (clientId: number) => {
  const result = await prisma.transaction.aggregate({
    where: {
      invoice: { clientId: clientId, paid: { equals: null } },
      debit: { name: 'Receivables' },
    },
    _sum: {
      amount: true,
    },
  });
  const amount = result._sum.amount || 0;
  return Number(amount);
};
