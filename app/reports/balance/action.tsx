import { getBalances, getTaxObligation } from '@/actions';

export const getRetainedEarning = async ({
  periodStart,
  periodEnd,
}: {
  periodStart: Date;
  periodEnd: Date;
}) => {
  const { total: income } = await getBalances(
    { type: 'INCOME', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );

  const { total: expenses } = await getBalances(
    { type: 'EXPENSES', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );

  const profit = Math.abs(income) - expenses;
  const taxObligation = await getTaxObligation();
  return profit - taxObligation;
};
