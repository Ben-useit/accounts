import {
  convertDateToString,
  convertNumberToString,
  convertStringToDate,
} from '@/utils/convert';
import { getBalances } from '@/actions';
import { getRetainedEarning } from './action';
import { getPeriod } from '@/prisma/queries';

const BalanceSheet = async () => {
  const data = await getPeriod();
  const periodStarts = convertStringToDate(data.periodStart) as Date;
  const periodEnds = convertStringToDate(data.periodEnd) as Date;
  const { total: assets, balances: assetBalances } = await getBalances(
    'ASSETS',
    periodStarts,
    periodEnds
  );
  const { total: liabilities, balances: liabilitiesBalances } =
    await getBalances('LIABILITIES', periodStarts, periodEnds);
  const { total: equity, balances: balancesEquity } = await getBalances(
    'EQUITY',
    periodStarts,
    periodEnds
  );

  const retainedEarning = await getRetainedEarning({
    periodStarts,
    periodEnds,
  });

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4 font-semibold'>
        Balance Sheet {convertDateToString(periodEnds)}
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
      <div className='grid grid-cols-4 gap-4 '>
        <div className='col-start-3 text-right font-semibold'>
          {convertNumberToString(Math.abs(liabilities))}
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
      <div className='grid grid-cols-4 gap-4 '>
        <div className='col-start-3 text-right font-semibold'>
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
            Math.abs(equity) + retainedEarning - liabilities
          )}
        </div>
      </div>
    </div>
  );
};
export default BalanceSheet;
