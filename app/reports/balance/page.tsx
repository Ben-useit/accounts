import {
  convertDateToString,
  convertNumberToString,
  convertStringToDate,
} from '@/utils/convert';
import { getBalances } from './action';
import DateSelector from './DateSelector';
import { redirect } from 'next/navigation';

const BalanceSheet = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { date } = await searchParams;
  const periodEnds =
    (convertStringToDate(date as string) as Date) || new Date();

  const { total: assets, balances: assetBalances } = await getBalances(
    'ASSETS',
    periodEnds
  );
  const { total: liabilities, balances: liabilitiesBalances } =
    await getBalances('LIABILITIES', periodEnds);
  const { total: equity, balances: balancesEquity } = await getBalances(
    'EQUITY',
    periodEnds
  );
  const formAction = async (formData: FormData) => {
    'use server';
    const { date } = Object.fromEntries(formData);
    redirect(`/reports/balance?date=${date}`);
  };
  return (
    <div className='lg:w-3/4'>
      <div className='grid grid-cols-2 mb-4'>
        <DateSelector formAction={formAction} label={'Period ends:'} />
      </div>
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
      <div className='grid grid-cols-4 gap-4 '>
        <div className='col-start-3 text-right font-semibold'>
          {convertNumberToString(Math.abs(equity))}
        </div>
      </div>
    </div>
  );
};
export default BalanceSheet;
