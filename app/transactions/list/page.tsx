import List from '@/components/List';
import { getAccounts } from '@/prisma/queries';
import { getStartBalance } from '@/actions';

const ListTransactions = async () => {
  const accounts = await getAccounts();

  const accountList: { id: number; name: string; balance: number }[] = [];
  let totalBalance = 0;
  for (const { id, name, type } of accounts) {
    const balance = await getStartBalance(id, type, new Date());
    totalBalance += balance;
    accountList.push({ id, name, balance });
  }
  return (
    <div className='lg:w-3/4'>
      <List
        items={accountList}
        totalBalance={totalBalance}
        redirectURL='/transactions/list'
        displayTotalBalance={false}
      />
    </div>
  );
};
export default ListTransactions;
