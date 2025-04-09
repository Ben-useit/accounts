import { getAccounts } from '@/prisma/queries';
import Form from './form';

const Transaction = async () => {
  const accounts = await getAccounts();

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl'>Transaction</div>
      <Form expensesAccounts={accounts} creditAccounts={accounts} />
    </div>
  );
};
export default Transaction;
