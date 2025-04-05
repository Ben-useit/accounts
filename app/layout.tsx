import type { Metadata } from 'next';
import './globals.css';
import MakeSidebar from '@/components/Sidebar';

import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'EasyCash',
  description: 'A UseIT! Accounting App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <div className='grid grid-cols-[256px_1fr_1fr_1fr] gap-2 p-2 m-4'>
          <div className=' col-span-4'>
            <Header />
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
