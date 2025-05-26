import { convertNumberToString } from '@/utils/convert';

type PropsType = {
  total: number;
  balances: {
    name: string;
    balance: number;
  }[];
};

const BalanceSheetComp = ({
  assetsProp,
  liabilitiesProp,
  equityProp,
  tax = 0,
  retainedEarning = 0,
  label,
}: {
  assetsProp: PropsType;
  liabilitiesProp: PropsType;
  equityProp: PropsType;
  tax?: number;
  retainedEarning?: number;
  label: string;
}) => {
  const { total: assets, balances: assetBalances } = assetsProp;
  const { total: liabilities, balances: liabilitiesBalances } = liabilitiesProp;
  const { total: equity, balances: equityBalances } = equityProp;
  const totalLiability = Math.abs(liabilities) + tax;

  return (
    <>
      <div className='text-2xl mb-4 font-semibold'>{label}:</div>
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
      {equityBalances.map((d, index) => {
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
    </>
  );
};
export default BalanceSheetComp;
