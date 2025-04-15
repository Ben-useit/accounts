'use client';

import { convertNumberToString } from '@/utils/convert';
import { redirect } from 'next/navigation';

function List({
  items,
  totalBalance,
  redirectURL,
}: {
  items: { id: number; name: string; balance: number }[];
  totalBalance: number;
  redirectURL: string;
}) {
  const handleClick = (itemId: number) => {
    redirect(`${redirectURL}/${itemId}`);
  };
  return (
    <>
      <div className='grid grid-cols-[10fr_3fr_1fr] gap-2 border-b pt-2 pb-2 mb-2'>
        <div className=' p-2 font-semibold'>Name</div>
        <div className=' p-2 text-right font-semibold'>Balance</div>
        <div></div>
      </div>
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className='grid grid-cols-[10fr_3fr_1fr] gap-2 border-b mb-2 pt-2 pb-4'
          >
            <div className='p-2'>{item.name}</div>
            <div className='p-2 text-right'>
              {convertNumberToString(item.balance)}
            </div>
            <button
              //className='bg-indigo-600 text-white flex border p-2 rounded-md text-right justify-end'
              className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              onClick={() => handleClick(item.id)}
            >
              Details
            </button>
          </div>
        );
      })}
      <div className='grid grid-cols-[10fr_3fr_1fr] gap-2 border-b pt-2 pb-2 mb-2'>
        <div className=' p-2 font-semibold'></div>
        <div className=' p-2 text-right font-semibold'>
          {totalBalance > 0 && convertNumberToString(totalBalance)}
        </div>
        <div></div>
      </div>
    </>
  );
}
export default List;
