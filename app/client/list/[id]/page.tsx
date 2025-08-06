'use server';
import { getClient, getPeriodAsDate } from '@/prisma/queries';
import InvoicesList from './component';
import prisma from '@/utils/db';
import { type InvoiceType } from '@/types';
const ClientDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = Number((await params).id);
  const client = await getClient(id);
  const { periodStart, periodEnd } = await getPeriodAsDate();
  const result = await prisma.invoice.findMany({
    where: {
      clientId: id,
      issued: { gte: periodStart, lte: periodEnd },
    },
    orderBy: [{ issued: 'desc' }],
  });
  const invoices: InvoiceType[] = result.map((invoice) => ({
    id: invoice.id,
    name: invoice.name,
    paid: invoice.paid,
    issued: invoice.issued,
    amount: invoice.amount.toNumber(),
  }));
  if (invoices.length === 0)
    return (
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>No innvoices for {client?.name}</div>
      </div>
    );

  return (
    <>
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>Invoices for {client?.name}</div>
        <InvoicesList invoices={invoices} />
      </div>
    </>
  );
};
export default ClientDetails;
