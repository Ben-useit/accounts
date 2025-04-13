import { getBalances } from '@/actions';

export const getRetainedEarning = async ({
  periodStart,
  periodEnd,
}: {
  periodStart: Date;
  periodEnd: Date;
}) => {
  const { total: income } = await getBalances(
    { type: 'INCOME' },
    {
      periodStart,
      periodEnd,
    }
  );

  const { total: expenses } = await getBalances(
    { type: 'EXPENSES' },
    {
      periodStart,
      periodEnd,
    }
  );

  return Math.abs(income) - expenses;
};
