import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <>
      <div className='flex place-items-center space-x-2'>
        <ChartBarIcon height={60} className='text-red-600' />
        <div className=' text-3xl'>Dashboard</div>
      </div>
    </>
  );
}
