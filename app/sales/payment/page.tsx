import { getInvoices } from '@/prisma/queries';
import Form from './form';

const InvoicePayment = async () => {
  const clients = await getInvoices();

  if (clients.length == 0) return <h1>No unpayed invoices!</h1>;

  return (
    <div className='lg:w-3/4'>
      <Form invoices={clients} />
    </div>
  );
};
export default InvoicePayment;
