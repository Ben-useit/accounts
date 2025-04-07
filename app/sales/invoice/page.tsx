import { getClients } from '@/prisma/queries';
import Form from './form';

const Invoice = async () => {
  const clients = await getClients();

  return (
    <div className='lg:w-3/4'>
      <Form clients={clients} />
    </div>
  );
};
export default Invoice;
