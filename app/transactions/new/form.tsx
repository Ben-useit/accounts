'use client';

import ButtonPanel from '@/components/ButtonPanel';
import DateInputField from '@/components/DateInputField';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';
import { actionTransaction } from './actions';

const Form = ({
  expensesAccounts,
  creditAccounts,
}: {
  expensesAccounts: { id: number; name: string }[];
  creditAccounts: { id: number; name: string }[];
}) => {
  const [expensesId, setExpensesId] = useState(1);
  const [creditId, setCreditId] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const action = async (prevState: string | null, formdata: FormData) => {
    const actionResult = await actionTransaction(
      expensesId,
      creditId,
      formdata
    );
    return actionResult;
  };
  const cancelAction = () => {
    formRef.current?.reset();
  };
  const [message, formAction] = useActionState(action, null);
  return (
    <>
      {message && <div className='text-xl'>{message}</div>}
      <form action={formAction} ref={formRef}>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div></div>
          <div></div>
          <div> </div>

          {/* </div>
        <div className='mt-2 grid grid-cols-4  gap-4'> */}
          <DateInputField
            label='Date'
            name='date'
            placeholder='Enter date dd/mm/yyyy'
          />
        </div>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div className='col-span-3'>
            <TextInputField
              label='Description'
              name='description'
              placeholder=''
            />
          </div>
          <div className='col-start-4'>
            <NumberInputField label='Amount' name='amount' placeholder='' />
          </div>
        </div>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div></div>
          <div></div>
          <Select
            label='Debit'
            defaultEntry={expensesId}
            style='w-full'
            entries={expensesAccounts}
            onSelect={setExpensesId}
          />
          <Select
            label='Credit'
            defaultEntry={creditId}
            style='w-full'
            entries={creditAccounts}
            onSelect={setCreditId}
          />
        </div>

        <div className='border-b mt-6 border-gray-300'></div>
        <div className='mt-2'>
          <ButtonPanel
            cancelButton={true}
            cancelAction={cancelAction}
            label='Submit'
          />
        </div>
      </form>
    </>
  );
};
export default Form;
