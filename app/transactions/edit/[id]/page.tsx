import { getAccounts } from '@/prisma/queries';
import { getTransaction } from './actions';
import Form from './component';

const EditTransaction = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirectTo: string }>;
}) => {
  const { id } = await params;
  const redirectParams = await searchParams;
  let redirectTo = redirectParams.redirectTo || '/';
  redirectTo = `${redirectTo}#${id}`;
  const result = await getTransaction(Number(id));
  const accounts = await getAccounts();
  if (!result) return <div>{`No transaction with ${id}`}</div>;
  const transaction = {
    ...result,
    amount: result.amount.toNumber(),
    rate: result.rate?.toNumber(),
  };
  return (
    <Form
      transaction={transaction}
      expensesAccounts={accounts}
      creditAccounts={accounts}
      redirectTo={redirectTo}
    />
  );
};
export default EditTransaction;
