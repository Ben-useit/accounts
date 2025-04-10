import { getClients } from '@/prisma/queries';
import ClientList from './component';
import { getBalance } from '@/prisma/queries';

const ListClient = async () => {
  const clients = await getClients();
  const clientList: { id: number; name: string; balance: number }[] = [];
  for (const { id, name } of clients) {
    const balance = await getBalance(id);
    clientList.push({ id, name, balance });
  }

  return (
    <div className='lg:w-3/4'>
      <ClientList clients={clientList} />
    </div>
  );
};
export default ListClient;
