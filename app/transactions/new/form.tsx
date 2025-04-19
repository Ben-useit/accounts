'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';
import { actionTransaction } from './actions';
import { convertDateToString } from '@/utils/convert';
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
  const formRef = useRef<HTMLFormElement>(null);
  const [invalid, setInvalid] = useState(false);
  const [descInput, setDescInput] = useState('');
  const [dateInput, setDateInput] = useState(convertDateToString(new Date()));
  const [amountInput, setAmountInput] = useState('');

  const action = async (prevState: string | null, formdata: FormData) => {
    const { error, message } = await actionTransaction(
      expensesId,
      creditId,
      formdata
    );
    if (error) toast.error(message);
    else {
      toast.success(message);
      setDescInput('');
      setAmountInput('');
    }
    return '';
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
            setInvalid={setInvalid}
            value={dateInput}
            setValue={setDateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
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
            <NumberInputField
              label='Amount'
              name='amount'
              placeholder=''
              value={amountInput}
              setValue={setAmountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              setInvalid={setInvalid}
            />
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
