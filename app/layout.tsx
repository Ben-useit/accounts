import type { Metadata } from 'next';
import './globals.css';
import MakeSidebar from '@/components/Sidebar';

import Header from '@/components/Header';
import { getPeriod } from '@/prisma/queries';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'EasyCash',
  description: 'A UseIT! Accounting App',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { periodStart, periodEnd } = await getPeriod();
  return (
    <html lang='en'>
      <body>
        <ToastContainer position='top-center' />
        <div className='grid grid-cols-[256px_1fr_1fr_1fr] gap-2 p-2 m-4'>
          <div className=' col-span-4'>
            <Header periodStart={periodStart} periodEnd={periodEnd} />
          </div>
          <div className='sm:grid sm:grid-cols-1 hidden '>
            <MakeSidebar
              isExpanded={true}
              position='relative'
              height='h-screen'
            />
          </div>
          <div className=' col-span-4 sm:col-span-3  p-8'>{children}</div>
        </div>
      </body>
    </html>
  );
}
