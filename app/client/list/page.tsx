import { getClients } from '@/prisma/queries';
import { getBalance } from '@/prisma/queries';
import List from '@/components/List';

const ListClient = async () => {
  const clients = await getClients();
  const clientList: { id: number; name: string; balance: number }[] = [];
  let totalBalance = 0;
  for (const { id, name } of clients) {
    const balance = await getBalance(id);
    totalBalance += balance;
    clientList.push({ id, name, balance });
  }

  return (
    <div className='lg:w-3/4'>
      <List
        items={clientList}
        totalBalance={totalBalance}
        redirectURL='/client'
      />
    </div>
  );
};
export default ListClient;
