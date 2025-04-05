'use client';
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import MakeSidebar from './Sidebar';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logoipsum-298.svg';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className='grid grid-cols-2 border-b border-b-emerald-100 pb-1'>
      <div className='flex'>
        <button
          onClick={() => setExpanded((curr: boolean) => !curr)}
          className='sm:hidden'
        >
          <Bars3Icon width={20} />
          {expanded && (
            <MakeSidebar
              position='absolute'
              isExpanded={false}
              height='h-max'
            />
          )}
        </button>
        <Link href='/' className='flex'>
          <Image
            src={logo}
            className={`w-8 pl-3 inline`}
            width={24}
            height={24}
            alt='Logo'
          />
        </Link>
        <div className='pl-2 pt-0.5 text-2xl hidden sm:inline'>EasyCash</div>
      </div>
      <div className='flex justify-end content-end'>
        <Link href='#'>
          <Cog6ToothIcon width={24} className='p-0.5' />
        </Link>
      </div>
    </div>
  );
};
export default Header;
