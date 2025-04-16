import { type TransactionListType } from './actions';
import { convertDateToString, convertNumberToString } from '@/utils/convert';
const TransactionList = ({
  transactions,
}: {
  transactions: TransactionListType[];
}) => {
  return (
    <>
      <div className='grid grid-cols-[2fr_8fr_2fr_2fr_2fr_1fr] gap-4 border-b pt-2 pb-2 mb-2 font-semibold'>
        <div className='text-center '>Date</div>
        <div className='text-left '>Description</div>
        <div className='content-center text-right pr-3'>Debit</div>
        <div className='content-center text-right pr-3'>Credit</div>
        <div className='content-center text-right pr-3'>Balance</div>
        <div className='text-right '></div>
      </div>
      {transactions.map((i) => {
        const { id, date, description, debit, credit, totalAmount } = i;

        return (
          <div
            className='grid grid-cols-[2fr_8fr_2fr_2fr_2fr_1fr] gap-4 border-b mb-2 pt-2 pb-4'
            key={id}
          >
            <div className='content-center text-center '>
              {convertDateToString(date)}
            </div>
            <div className='content-center '>{description}</div>
            <div className=' content-center text-right '>
              {debit > 0 && convertNumberToString(debit)}
            </div>
            <div className='content-center text-right'>
              {credit > 0 && convertNumberToString(credit)}
            </div>
            <div className='content-center text-right'>
              {convertNumberToString(totalAmount)}
            </div>
            <button className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
              Details
            </button>
          </div>
        );
      })}
    </>
  );
};

export default TransactionList;
