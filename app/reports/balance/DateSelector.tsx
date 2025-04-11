'use client';
import ButtonPanel from '@/components/ButtonPanel';
import DateInputField from '@/components/DateInputField';

const DateSelector = ({
  label,
  formAction,
}: {
  label: string;
  formAction: (arg: FormData) => void;
}) => {
  return (
    <div>
      <form action={formAction}>
        <div className='grid grid-cols-3 gap-4 '>
          <div className='col-span-2 '>
            <DateInputField label={label} name={'date'} />
          </div>
          <ButtonPanel label='submit' />
        </div>
      </form>
    </div>
  );
};
export default DateSelector;
