import { getAccount } from '@/prisma/queries';
import { getTransactions } from './actions';
import TransactionList from './component';

const AccountDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = Number((await params).id);
  const data = await getAccount({ id });
  if (!data)
    return (
      <div className='lg:w-3/4'>{`Account with id ${id} does not exist.`}</div>
    );
  const { name, type } = data;
  const transactions = await getTransactions(id, type);
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
