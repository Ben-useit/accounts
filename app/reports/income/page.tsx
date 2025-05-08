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
  const {
    total: expensesBusinessForexConverted,
    balances: expensesBusinessForexConvertedBalances,
  } = await getBalances(
    { type: 'EXPENSES', currency: 'Euro', domain: 'BUSINESS' },
    {
      periodStart,
      periodEnd,
    },
    true
  );
  const { total: incomeForex, balances: incomeForexBalances } =
    await getBalances(
      { type: 'INCOME', currency: 'Euro' },
      {
        periodStart,
        periodEnd,
      }
    );

  const {
    total: expensesPrivateForex,
    balances: expensesPrivateForexBalances,
  } = await getBalances(
    { type: 'EXPENSES', currency: 'Euro', domain: 'PERSONAL' },
    {
      periodStart,
      periodEnd,
    }
  );

  const {
    total: expensesBusinessForex,
    balances: expensesBusinessForexBalances,
  } = await getBalances(
    { type: 'EXPENSES', currency: 'Euro', domain: 'BUSINESS' },
    {
      periodStart,
      periodEnd,
    }
  );

  const profitLoss = Math.abs(incomeBusiness) - expensesBusiness;
  const taxBase = profitLoss - expensesBusinessForexConverted;
  const netIncome = profitLoss - tax;
  const availableIncome = netIncome + Math.abs(incomePrivate);
  const finalBalance = availableIncome - expensesPrivate;
  const totalForexExpenses = expensesPrivateForex + expensesBusinessForex;
  const forexResult = Math.abs(incomeForex) - totalForexExpenses;
  //TODO Hardcoded value
  const forexResultMWK = forexResult * 4000;
  const overallResult = finalBalance + forexResultMWK;

  return (
    <div className='lg:w-3/4'>
      <div className='text-xl mb-4 font-semibold'>
        Income Statement {convertDateToString(periodStart)} -{' '}
        {convertDateToString(periodEnd)}
      </div>
      <div className='text-xl mb-4 mt-4 font-semibold'>1. Business:</div>
      <BlockComponent
        label='Business Income:'
        balances={incomeBusinessBalances}
        total={incomeBusiness}
      />
      <BlockComponent
        label='Business Expenses:'
        balances={expensesBusinessBalances}
        total={expensesBusiness}
      />

      <TotalComponent
        label={profitLoss > 0 ? 'Profit in period:' : 'Loss in period:'}
        total={profitLoss}
      />

      <div className='text-xl mb-4 mt-4 font-semibold'>2. Tax Calculation:</div>
      {profitLoss <= 0 ? (
        <TotalComponent label='No taxable Income' total={0} style='mb-4' />
      ) : (
        <>
          <BlockComponent
            label='Additional Forex Expenses:'
            balances={expensesBusinessForexConvertedBalances}
            total={expensesBusinessForexConverted}
          />
          <TotalComponent label={'Taxable Income:'} total={taxBase} />
          <TotalComponent label={'Income Tax:'} total={tax} />
        </>
      )}
      <div className='text-xl mb-4 mt-4 font-semibold'>3. Income Malawi:</div>
      <TotalComponent label={'Net Business Income:'} total={netIncome} />
      <BlockComponent
        label='Additional Income:'
        balances={incomePrivateBalances}
        total={incomePrivate}
      />
      <TotalComponent
        label={'Available Income:'}
        total={availableIncome}
        style='mb-4'
      />
      <div className='text-xl mb-4 mt-4 font-semibold'>
        4. Personal Expenses Malawi:
      </div>
      <BlockComponent
        label=''
        balances={expensesPrivateBalances}
        total={expensesPrivate}
      />
      <TotalComponent
        label={finalBalance > 0 ? 'Profit in period:' : 'Loss in period:'}
        total={finalBalance}
        style={finalBalance > 0 ? 'mb-4' : 'mb-4 text-red-500'}
      />

      <div className='text-2xl mb-4 mt-4 font-semibold'>B. GERMANY</div>
      <div className='text-xl mb-4 mt-4 font-semibold'>1. Income:</div>
      <BlockComponent
        label=''
        balances={incomeForexBalances}
        total={incomeForex}
      />
      <div className='text-xl mb-4 mt-4 font-semibold'>2. Expenses:</div>
      <BlockComponent
        label='Personal:'
        balances={expensesPrivateForexBalances}
        total={expensesPrivateForex}
      />
      <BlockComponent
        label='Business:'
        balances={expensesBusinessForexBalances}
        total={expensesBusinessForex}
      />
      <TotalComponent
        label='Balance:'
        total={totalForexExpenses}
        style='mb-4'
      />
      <TotalComponent
        label={forexResult > 0 ? 'Profit in period:' : 'Loss in period:'}
        total={forexResult}
        style={forexResult > 0 ? 'mb-4' : 'mb-4 text-red-500'}
      />
      {forexResult > 0 && (
        <>
          <TotalComponent
            label={
              forexResult > 0
                ? 'Profit converted in MWK:'
                : 'Loss converted in MWK:'
            }
            total={forexResult * 4000}
            style={forexResult > 0 ? 'mb-4' : 'mb-4 text-red-500'}
          />
          <TotalComponent
            label={
              overallResult > 0
                ? 'Overall Profit in MWK:'
                : 'Overall Loss in MWK:'
            }
            total={overallResult}
            style={overallResult > 0 ? 'mb-4' : 'mb-4 text-red-500'}
          />
        </>
      )}
    </div>
  );
};
export default IncomeStatement;
