'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState } from 'react';
import { actionWithdrawal } from './actions';
import { toast } from 'react-toastify';

const Form = ({
  expensesAccounts,
  creditAccounts,
}: {
  expensesAccounts: { id: number; name: string }[];
  creditAccounts: { id: number; name: string }[];
}) => {
  const [expensesId, setExpensesId] = useState(1);
  const [creditId, setCreditId] = useState(1);
  const [descInput, setDescInput] = useState('');
  const action = async (prevState: string | null, formdata: FormData) => {
    const { error, message } = await actionWithdrawal(
      expensesId,
      creditId,
      formdata
    );
    if (error) {
      toast.error(message);
    } else {
      toast.success(message);
    }
    setDescInput('');
    return '';
  };
  const cancelAction = () => {
    setDescInput('');
  };
  const [message, formAction] = useActionState(action, null);
  const [invalid, setInvalid] = useState(false);
  return (
    <>
      <form action={formAction}>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div>{message && message}</div>
          <div></div>
          <div> </div>
          <DateInputField label='Date' name='date' setInvalid={setInvalid} />
        </div>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div className='col-span-3'>
            <TextInputField
              label='Description'
              name='description'
              placeholder=''
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
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
            invalid={invalid}
          />
        </div>
      </form>
    </>
  );
};
export default Form;
