import { getExpensesAccounts, getFundsAccounts } from '@/prisma/queries';
import Form from './form';

const Withrawal = async () => {
  const expensesAccounts = await getExpensesAccounts(false);
  const creditAccounts = await getFundsAccounts();

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl'>Vat Invoice</div>
      <Form
        expensesAccounts={expensesAccounts}
        creditAccounts={creditAccounts}
      />
    </div>
  );
};
export default Withrawal;
