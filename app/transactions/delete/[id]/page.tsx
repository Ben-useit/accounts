import { getAllTransactions } from './actions';
import DeleteConfirm from './component';

const DeleteTransaction = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const props = await getAllTransactions(id);
  if (props.transactions.length === 0)
    return <div className='lg:w-3/4 text-2xl'>Nothing to do</div>;

  return (
    <DeleteConfirm id={id} props={props} redirectTo={`/transactions/list`} />
  );
};
export default DeleteTransaction;
