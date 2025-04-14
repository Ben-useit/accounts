'use server';
import { getClient, getBalance } from '@/prisma/queries';
import { getInvoices } from './actions';
import InvoicesList from './component';

const ClientDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = Number((await params).id);
  const client = await getClient(id);
  const invoices = await getInvoices(id);
  if (invoices.length === 0)
    return (
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>No innvoices for {client?.name}</div>
      </div>
    );
  const balance = await getBalance(id);

  return (
    <>
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>Invoices for {client?.name}</div>
        <InvoicesList invoices={invoices} balance={balance} />
      </div>
    </>
  );
};
export default ClientDetails;
