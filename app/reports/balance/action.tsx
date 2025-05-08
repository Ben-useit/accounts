import { getBalances, getTaxObligation } from '@/actions';

export const getRetainedEarning = async ({
  periodStart,
  periodEnd,
  currency,
}: {
  periodStart: Date;
  periodEnd: Date;
  currency: string;
}) => {
  const { total: income } = await getBalances(
    { type: 'INCOME', currency: currency },
    {
      periodStart,
      periodEnd,
    }
  );

  const { total: expenses } = await getBalances(
    { type: 'EXPENSES', currency: currency },
    {
      periodStart,
      periodEnd,
    }
  );

  const profit = Math.abs(income) - expenses;
  if (currency === 'MWK') {
    const taxObligation = await getTaxObligation();
    return profit - taxObligation;
  }
  return profit;
};
