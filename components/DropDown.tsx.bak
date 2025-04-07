'use client';

import { redirect } from 'next/navigation';
import { useState } from 'react';

import { ArrowDownIcon } from '@heroicons/react/24/outline';

type LinkType = {
  url: string;
  name: string;
};

const DropDown = ({
  entries,
  label,
}: {
  entries: LinkType[];
  label: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(!isOpen);
  };
  const selectItem = (url: string) => {
    setIsOpen(false);
    redirect(url);
  };
  return (
    <div className='inline relative'>
      <div className='cursor-pointer inline' onClick={open}>
        {label}
        <ArrowDownIcon className='inline' height={20} />
      </div>

      {isOpen && (
        <ul className='absolute text-black top-full right-0 mt-2 max-h-44 overflow-y-auto z-20 bg-gray-100'>
          {entries.map((entry, index) => {
            return (
              <li
                key={index}
                onClick={() => selectItem(entry.url)}
                className='p-2.5 cursor-pointer w-full hover:bg-blue-200 hover:w-full'
              >
                {entry.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default DropDown;
