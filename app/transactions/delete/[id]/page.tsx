import { getAllTransactions } from './actions';
import DeleteConfirm from './component';

const DeleteTransaction = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirectTo: string }>;
}) => {
  const { id } = await params;
  const redirectParams = await searchParams;
  const redirectTo = redirectParams.redirectTo || '/';

  const props = await getAllTransactions(id);
  if (props.transactions.length === 0)
    return <div className='lg:w-3/4 text-2xl'>Nothing to do</div>;

  return <DeleteConfirm id={id} props={props} redirectTo={`${redirectTo}`} />;
};
export default DeleteTransaction;
