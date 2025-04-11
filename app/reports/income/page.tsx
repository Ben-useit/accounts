import {
  convertDateToString,
  convertNumberToString,
  convertStringToDate,
} from '@/utils/convert';
import { getBalances } from './action';
import PeriodSelector from './PeriodSelector';
import { redirect } from 'next/navigation';

const IncomeStatement = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { dateFrom, dateTo } = await searchParams;
  const periodEnds =
    (convertStringToDate(dateTo as string) as Date) || new Date();
  const periodStarts =
    (convertStringToDate(dateFrom as string) as Date) || new Date();

  const { total: income, balances: incomeBalances } = await getBalances(
    'INCOME',
    periodStarts,
    periodEnds
  );
  const { total: expenses, balances: expensesBalances } = await getBalances(
    'EXPENSES',
    periodStarts,
    periodEnds
  );

  const total = -income - expenses;

  const formAction = async (formData: FormData) => {
    'use server';
    const { dateFrom, dateTo } = Object.fromEntries(formData);
    redirect(`/reports/income?dateFrom=${dateFrom}&dateTo=${dateTo}`);
  };
  return (
    <div className='lg:w-3/4'>
      <div className='grid grid-cols-2 mb-4'>
        <PeriodSelector formAction={formAction} />
      </div>
      <div className='text-2xl mb-4 font-semibold'>
        Income Statement {convertDateToString(periodStarts)} -{' '}
        {convertDateToString(periodEnds)}
      </div>
      <div className='text-2xl font-semibold'>Income</div>
      {incomeBalances.map((d, index) => {
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
          {convertNumberToString(Math.abs(income))}
        </div>
      </div>
      <div className='text-2xl font-semibold'>Expenses</div>
      {expensesBalances.map((d, index) => {
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
          {convertNumberToString(Math.abs(expenses))}
        </div>
      </div>
      {/* className={total < 0 ? 'text-red-600 text-right' : 'text-right'} */}
      <div className='grid grid-cols-4 gap-4 mt-4   '>
        <div className='text-2xl font-semibold '>
          {total > 0 ? 'Profit' : 'Loss'} in period:
        </div>
        <div className='text-2xl col-start-3 text-right font-semibold  justify-end'>
          {convertNumberToString(Math.abs(total))}
        </div>
      </div>
    </div>
  );
};
export default IncomeStatement;
