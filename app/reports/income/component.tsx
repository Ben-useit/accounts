import { convertNumberToString } from '@/utils/convert';
export const TotalComponent = ({
  label,
  total,
  style,
}: {
  label: string;
  total: number;
  style?: string;
}) => {
  return (
    <div className={`grid grid-cols-4 gap-4 mt-4  `}>
      <div className='text-xl col-span-2 font-semibold '>{label}</div>
      <div
        className={`text-xl col-start-3 text-right font-semibold  justify-end ${style}`}
      >
        {convertNumberToString(total)}
      </div>
    </div>
  );
};

export const BlockComponent = ({
  label,
  balances,
  total,
}: {
  label: string;
  balances: {
    name: string;
    balance: number;
  }[];
  total: number;
}) => {
  return (
    <>
      <div className='text-xl font-semibold'>{label}</div>
      {balances.map((d, index) => {
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
          {convertNumberToString(Math.abs(total))}
        </div>
      </div>
    </>
  );
};
export default BlockComponent;
