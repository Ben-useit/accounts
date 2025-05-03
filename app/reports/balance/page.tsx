import { convertDateToString, convertNumberToString } from '@/utils/convert';
import { getBalances, getTaxObligation } from '@/actions';
import { getRetainedEarning } from './action';
import { getPeriodAsDate } from '@/prisma/queries';

const BalanceSheet = async () => {
  const { periodStart, periodEnd } = await getPeriodAsDate(true);
  let tax = await getTaxObligation();
  let { total: taxPayable } = await getBalances(
    { name: 'Income Tax Payable', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );
  tax += Math.abs(taxPayable);

  const { total: assets, balances: assetBalances } = await getBalances(
    { type: 'ASSETS', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );
  const { total: liabilities, balances: liabilitiesBalances } =
    await getBalances(
      { type: 'LIABILITIES', currency: 'MWK' },
      {
        periodStart,
        periodEnd,
      }
    );
  const { total: equity, balances: balancesEquity } = await getBalances(
    { type: 'EQUITY', currency: 'MWK' },
    {
      periodStart,
      periodEnd,
    }
  );

  const retainedEarning = await getRetainedEarning({
    periodStart,
    periodEnd,
  });

  const totalLiability = Math.abs(liabilities) + tax; // Math.abs(equity) + retainedEarning;

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4 font-semibold'>
        Balance Sheet {convertDateToString(periodEnd)}
      </div>
      <div className='text-2xl font-semibold'>Assets</div>
      {assetBalances.map((d, index) => {
        return (
          <div className='grid grid-cols-4 gap-4' key={index}>
            <div>{d.name}</div>
            <div className='text-right'>{convertNumberToString(d.balance)}</div>
          </div>
        );
      })}

      <div className='grid grid-cols-4 gap-4 '>
        <div className='col-start-3 text-right font-semibold'>
          {convertNumberToString(assets)}
        </div>
      </div>

      {/* TOTAL ASSETS */}
      <div className='grid grid-cols-4 gap-4 mb-4'>
        <div className='col-span-2 text-2xl font-semibold'>Total Assets</div>
        <div className='col-start-3 text-2xl text-right font-semibold'>
          {convertNumberToString(Math.abs(assets))}
        </div>
      </div>

      {/* LIABILITIES */}
      <div className='text-2xl font-semibold'>Liabilities</div>
      {liabilitiesBalances.map((d, index) => {
        return (
          <div className='grid grid-cols-4 gap-4' key={index}>
            <div>{d.name}</div>
            <div className='text-right '>
              {convertNumberToString(Math.abs(d.balance))}
            </div>
          </div>
        );
      })}

      <div className='grid grid-cols-4 gap-4'>
        <div>Income Tax Payable</div>
        <div className='text-right '>{convertNumberToString(tax)}</div>
      </div>

      <div className='grid grid-cols-4 gap-4 mt-4 mb-4'>
        <div className='col-span-2 text-2xl font-semibold'>
          Total Liabilities
        </div>
        <div className='col-start-3 text-2xl text-right font-semibold'>
          {convertNumberToString(Math.abs(liabilities) + tax)}
        </div>
      </div>

      {/* EQUITY */}
      <div className='text-2xl font-semibold'>Equity</div>
      {balancesEquity.map((d, index) => {
        return (
          <div className='grid grid-cols-4 gap-4' key={index}>
            <div>{d.name}</div>
            <div className='text-right'>
              {convertNumberToString(Math.abs(d.balance))}
            </div>
          </div>
        );
      })}
      <div className='grid grid-cols-4 gap-4'>
        <div>Retained Earnings</div>
        <div className='text-right'>
          {convertNumberToString(retainedEarning)}
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 mt-4 mb-4'>
        <div className='col-span-2 text-2xl font-semibold'>Total Equity</div>
        <div className='col-start-3 text-2xl text-right font-semibold'>
          {convertNumberToString(Math.abs(equity) + retainedEarning)}
        </div>
      </div>
      {/* LIABILITIES & EQUITY */}
      <div className='grid grid-cols-4 gap-4 '>
        <div className='col-span-2 text-2xl font-semibold'>
          Total Liabilities & Equity
        </div>
        <div className='col-start-3 text-2xl text-right font-semibold'>
          {convertNumberToString(
            Math.abs(equity) + retainedEarning + totalLiability
          )}
        </div>
      </div>
    </div>
  );
};
export default BalanceSheet;
