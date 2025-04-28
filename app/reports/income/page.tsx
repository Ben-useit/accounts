import { convertDateToString } from '@/utils/convert';
import { getBalances, getTaxObligation } from '@/actions';
import { getPeriodAsDate } from '@/prisma/queries';
import BlockComponent, { TotalComponent } from './component';

const IncomeStatement = async () => {
  const { periodStart, periodEnd } = await getPeriodAsDate();
  const tax = await getTaxObligation();

  const { total: incomeBusiness, balances: incomeBusinessBalances } =
    await getBalances(
      { type: 'INCOME', group: 'Taxable' },
      {
        periodStart,
        periodEnd,
      }
    );
  const { total: incomePrivate, balances: incomePrivateBalances } =
    await getBalances(
      { type: 'INCOME', group: 'Private' },
      {
        periodStart,
        periodEnd,
      }
    );
  const { total: expensesBusiness, balances: expensesBusinessBalances } =
    await getBalances(
      { type: 'EXPENSES', domain: 'BUSINESS', currency: 'MWK' },
      {
        periodStart,
        periodEnd,
      }
    );
  const { total: expensesPrivate, balances: expensesPrivateBalances } =
    await getBalances(
      { type: 'EXPENSES', group: 'Private' },
      {
        periodStart,
        periodEnd,
      }
    );

  const grossIncome = Math.abs(incomeBusiness) - expensesBusiness;
  const netIncome = grossIncome - tax;
  const availableIncome = netIncome + Math.abs(incomePrivate);
  const finalBalance = availableIncome - expensesPrivate;

  return (
    <div className='lg:w-3/4'>
      <div className='text-xl mb-4 font-semibold'>
        Income Statement {convertDateToString(periodStart)} -{' '}
        {convertDateToString(periodEnd)}
      </div>
      <BlockComponent
        label='Income'
        balances={incomeBusinessBalances}
        total={incomeBusiness}
      />
      <BlockComponent
        label='Expense'
        balances={expensesBusinessBalances}
        total={expensesBusiness}
      />

      <TotalComponent
        label={grossIncome > 0 ? 'Profit in period:' : 'Loss in period:'}
        total={grossIncome}
      />
      <TotalComponent label={'Income Tax:'} total={tax} />
      <TotalComponent label={'Net Income:'} total={netIncome} />
      <BlockComponent
        label='Additional Income'
        balances={incomePrivateBalances}
        total={incomePrivate}
      />
      <TotalComponent
        label={'Available Income:'}
        total={availableIncome}
        style='mb-4 border-b'
      />
      <BlockComponent
        label='Private Expenses'
        balances={expensesPrivateBalances}
        total={expensesPrivate}
      />
      <TotalComponent
        label={finalBalance > 0 ? 'Profit in period:' : 'Loss in period:'}
        total={finalBalance}
        style='mb-4 border-b'
      />
    </div>
  );
};
export default IncomeStatement;
