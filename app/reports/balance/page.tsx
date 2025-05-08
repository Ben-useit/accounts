import { convertDateToString, convertNumberToString } from '@/utils/convert';
import { getBalances, getTaxObligation } from '@/actions';
import { getRetainedEarning } from './action';
import { getPeriodAsDate } from '@/prisma/queries';
import BalanceSheetComp from './component';

const BalanceSheet = async () => {
  const { periodStart, periodEnd } = await getPeriodAsDate(true);
  let tax = await getTaxObligation();

  const { total: taxPayable } = await getBalances(
    { name: 'Income Tax Payable', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );
  tax += Math.abs(taxPayable);

  const assetPropsMWK = await getBalances(
    { type: 'ASSETS', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );
  const liabilityPropsMWK = await getBalances(
    { type: 'LIABILITIES', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );
  const equityPropsMWK = await getBalances(
    { type: 'EQUITY', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );

  const retainedEarningMWK = await getRetainedEarning({
    periodStart,
    periodEnd,
    currency: 'MWK',
  });
  const retainedEarningEuro = await getRetainedEarning({
    periodStart,
    periodEnd,
    currency: 'Euro',
  });
  const equityPropsEuro = await getBalances(
    { type: 'EQUITY', currency: 'Euro' },
    {
      periodStart,
      periodEnd,
    }
  );
  const liabilityPropsEuro = await getBalances(
    { type: 'LIABILITIES', currency: 'Euro' },
    {
      periodStart,
      periodEnd,
    }
  );
  const assetPropsEuro = await getBalances(
    { type: 'ASSETS', currency: 'Euro' },
    {
      periodStart,
      periodEnd,
    }
  );
  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4 font-semibold'>
        Balance Sheet {convertDateToString(periodEnd)}
      </div>
      <BalanceSheetComp
        assetsProp={assetPropsMWK}
        liabilitiesProp={liabilityPropsMWK}
        equityProp={equityPropsMWK}
        tax={tax}
        retainedEarning={retainedEarningMWK}
        label='Malawi'
      />
      <BalanceSheetComp
        assetsProp={assetPropsEuro}
        liabilitiesProp={liabilityPropsEuro}
        equityProp={equityPropsEuro}
        tax={0}
        retainedEarning={retainedEarningEuro}
        label='Germany'
      />
    </div>
  );
};
export default BalanceSheet;
