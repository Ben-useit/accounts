import { CheckIcon } from '@heroicons/react/24/outline';
import { convertDateToString, convertNumberToString } from '@/utils/convert';
import { roundCurrency } from '@/utils/currency';
import { type InvoiceType } from '@/types';

const InvoicesList = ({
  invoices,
  grossBalance,
  includedVat,
  includedNoEFDVat,
}: {
  invoices: InvoiceType[];
  grossBalance: number;
  includedVat: number;
  includedNoEFDVat: number;
}) => {
  // The invoice amount is always the amount incl. VAT ( Gross )
  const totalReceivables = grossBalance - includedVat - includedNoEFDVat;
  return (
    <>
      <div className='grid grid-cols-[30px_90px__5fr_2fr_2fr_2fr_90px] gap-4 border-b pt-2 pb-2 mb-2 font-semibold'>
        <div></div>
        <div className='text-center '>Date</div>
        <div className='text-left '>Description</div>
        <div className='text-right '>Net</div>
        <div className='text-right '>VAT</div>
        <div className='text-right '>Gross</div>
        <div className='text-center '>Paid</div>
        {/* <div className='text-right '></div> */}
      </div>
      {invoices.map((invoice) => {
        const netAmount = roundCurrency(invoice.amount / 1.165);
        const vatAmount = roundCurrency((invoice.amount * 0.165) / 1.165);
        return (
          <div
            className='grid grid-cols-[30px_90px__5fr_2fr_2fr_2fr_90px] gap-4 border-b mb-2 pt-2 pb-4'
            key={invoice.id}
          >
            <div className='content-center '>
              {invoice.paid && <CheckIcon color='green' height={24} />}
            </div>
            <div className='content-center text-center '>
              {convertDateToString(invoice.issued)}
            </div>
            <div className='content-center '>{invoice.name}</div>
            <div className=' content-center text-right '>
              {convertNumberToString(netAmount)}
            </div>
            <div className=' content-center text-right '>
              {convertNumberToString(vatAmount)}
            </div>
            <div className=' content-center text-right '>
              {convertNumberToString(invoice.amount)}
            </div>
            <div className='text-right content-center '>
              {invoice.paid && convertDateToString(invoice.paid)}
            </div>{' '}
            {/* <button
              //className='bg-indigo-600 text-white flex border p-2 rounded-md text-right justify-end'
              className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Details
            </button> */}
          </div>
        );
      })}
      <div className='grid grid-cols-[30px_90px__5fr_2fr_2fr_2fr_90px] gap-4 mb-2 pt-2 pb-4'>
        <div className='col-start-4 col-span-3 text-right'>
          Total Balance:
          <span className='font-semibold pl-4'>
            {convertNumberToString(grossBalance)}
          </span>
        </div>
        <div className='col-start-3 col-span-4 text-right'>
          includes VAT :
          <span className='font-semibold pl-4'>
            {convertNumberToString(includedVat)}
          </span>
        </div>
        <div className='col-start-3 col-span-4 text-right'>
          includes VAT ( no EFD receipt):
          <span className='font-semibold pl-4'>
            {convertNumberToString(includedNoEFDVat)}
          </span>
        </div>
        <div className='col-start-3 col-span-4 text-right'>
          Total Receivables:
          <span className='font-semibold pl-4'>
            {convertNumberToString(totalReceivables)}
          </span>
        </div>
      </div>
    </>
  );
};

export default InvoicesList;
