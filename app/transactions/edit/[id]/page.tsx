import { getAccounts } from '@/prisma/queries';
import { getTransaction } from './actions';
import Form from './component';

const EditTransaction = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getTransaction(Number(id));
  const accounts = await getAccounts();
  if (!result) return <div>{`No transaction with ${id}`}</div>;
  const transaction = {
    ...result,
    amount: result.amount.toNumber(),
  };
  return (
    <Form
      transaction={transaction}
      expensesAccounts={accounts}
      creditAccounts={accounts}
    />
  );
};
export default EditTransaction;
