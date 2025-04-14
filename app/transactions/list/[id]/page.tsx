import { getAccount } from '@/prisma/queries';
import { getTransactions } from './actions';
import TransactionList from './component';

const AccountDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = Number((await params).id);
  const { name } = await getAccount({ id });
  const transactions = await getTransactions(id);
  if (transactions.length === 0)
    return (
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>{`No transactions for account: ${name}`}</div>
      </div>
    );

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4'>{`Transactions for account: ${name}`}</div>
      <TransactionList transactions={transactions} />
    </div>
  );
};
export default AccountDetail;
