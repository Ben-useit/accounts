import { getInvoices } from '@/prisma/queries';
import Form from './form';

const InvoicePayment = async () => {
  const invoices = await getInvoices();
  console.log('page load: ', invoices);

  if (invoices.length == 0) return <h1>No unpayed invoices!</h1>;

  return (
    <div className='lg:w-3/4'>
      <Form invoices={invoices} />
    </div>
  );
};
export default InvoicePayment;
