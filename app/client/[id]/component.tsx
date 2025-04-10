import { CheckIcon } from '@heroicons/react/24/outline';
import { type InvoiceType } from './actions';
import { convertDateToString, convertNumberToString } from '@/utils/convert';
const InvoicesList = ({
  invoices,
  balance,
}: {
  invoices: InvoiceType[];
  balance: number;
}) => {
  return (
    <>
      <div className='grid grid-cols-[30px_90px__5fr_2fr_90px_2fr_90px] gap-4 border-b pt-2 pb-2 mb-2 font-semibold'>
        <div></div>
        <div className='text-center '>Date</div>
        <div className='text-left '>Description</div>
        <div className='text-right '>Amount</div>
        <div className='text-center '>Payed</div>
        <div className='text-right '>Amount</div>
        <div className='text-right '></div>
      </div>
      {invoices.map((i) => {
        const { invoice, data } = i;

        return (
          <div
            className='grid grid-cols-[30px_90px_5fr_2fr_90px_2fr_90px] gap-4 border-b mb-2 pt-2 pb-4'
            key={invoice.id}
          >
            <div className='content-center '>
              {invoice.payed && <CheckIcon color='green' height={24} />}
            </div>
            <div className='content-center text-center '>
              {convertDateToString(data.issued.date)}
            </div>
            <div className='content-center '>{invoice.name}</div>
            <div className=' content-center text-right '>
              {convertNumberToString(data.issued.amount)}
            </div>
            <div className='content-center text-center '>
              {invoice.payed &&
                data.payed.date &&
                convertDateToString(data.payed.date)}
            </div>
            <div className='text-right content-center '>
              {invoice.payed && convertNumberToString(data.issued.amount)}
            </div>
            <button
              //className='bg-indigo-600 text-white flex border p-2 rounded-md text-right justify-end'
              className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Details
            </button>
          </div>
        );
      })}
      <div className='grid grid-cols-[30px_90px__5fr_2fr_90px_2fr_90px] gap-2 pt-2 pb-2 mb-2'>
        <div className='col-start-4 col-span-3 text-right'>
          Total Balance:
          <span className='font-semibold pl-4'>
            {convertNumberToString(balance)}
          </span>
        </div>
      </div>
    </>
  );
};

export default InvoicesList;
