'use client';
import ButtonPanel from '@/components/ButtonPanel';
import DateInputField from '@/components/DateInputField';

const PeriodSelector = ({
  formAction,
}: {
  formAction: (arg: FormData) => void;
}) => {
  return (
    <div>
      <form action={formAction}>
        <div className='grid grid-cols-5 gap-4 '>
          <div className='col-span-2 '>
            <DateInputField label='From' name={'dateFrom'} />
          </div>
          <div className='col-span-2 '>
            <DateInputField label='To' name={'dateTo'} />
          </div>
          <ButtonPanel label='submit' />
        </div>
      </form>
    </div>
  );
};
export default PeriodSelector;
