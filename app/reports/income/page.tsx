import {
  convertDateToString,
  convertNumberToString,
  convertStringToDate,
} from '@/utils/convert';
import { getBalances, getTaxObligation } from '@/actions';
import { getPeriod } from '@/prisma/queries';

const IncomeStatement = async () => {
  const data = await getPeriod();
  const tax = await getTaxObligation();
  const periodStart = convertStringToDate(data.periodStart) as Date;
  const periodEnd = convertStringToDate(data.periodEnd) as Date;
  const { total: income, balances: incomeBalances } = await getBalances(
    { type: 'INCOME' },
    {
      periodStart,
      periodEnd,
    }
  );
  const { total: expenses, balances: expensesBalances } = await getBalances(
    { type: 'EXPENSES' },
    {
      periodStart,
      periodEnd,
    }
  );

  const total = -income - expenses;
  const netTotal = total - tax;

  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4 font-semibold'>
        Income Statement {convertDateToString(periodStart)} -{' '}
        {convertDateToString(periodEnd)}
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
        <div className='text-2xl col-span-2 font-semibold '>
          {total > 0 ? 'Gross profit' : 'Loss'} in period:
        </div>
        <div className='text-2xl col-start-3 text-right font-semibold  justify-end'>
          {convertNumberToString(Math.abs(total))}
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 mt-4   '>
        <div className='text-xl col-span-2 font-semibold '>
          {tax > 0 && 'Tax obligation:'}
        </div>
        <div className='text-xl col-start-3 text-right font-semibold  justify-end'>
          {tax > 0 && convertNumberToString(Math.abs(tax))}
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4 mt-4   '>
        <div className='text-2xl col-span-2 font-semibold '>
          {netTotal > 0 ? 'Net profit' : 'Loss'} in period:
        </div>
        <div className='text-2xl col-start-3 text-right font-semibold  justify-end'>
          {convertNumberToString(Math.abs(netTotal))}
        </div>
      </div>
    </div>
  );
};
export default IncomeStatement;
