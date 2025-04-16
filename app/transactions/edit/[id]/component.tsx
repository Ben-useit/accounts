'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';
import { convertDateToString, convertNumberToString } from '@/utils/convert';
import { actionTransaction } from './actions';
import CheckboxField from '@/components/CheckboxField';

type TransactionType = {
  id: number;
  date: Date;
  amount: number;
  debitId: number;
  creditId: number;
  description: string | null;
  invoiceId: number | null;
};

const Form = ({
  transaction,
  expensesAccounts,
  creditAccounts,
}: {
  transaction: TransactionType;
  expensesAccounts: { id: number; name: string }[];
  creditAccounts: { id: number; name: string }[];
}) => {
  // Need to set the correct value here
  const debitSelId = expensesAccounts.findIndex(
    ({ id }) => id === transaction.debitId
  );
  const creditSelId = expensesAccounts.findIndex(
    ({ id }) => id === transaction.creditId
  );
  const [expensesId, setExpensesId] = useState(debitSelId + 1);
  const [creditId, setCreditId] = useState(creditSelId + 1);
  const [invalid, setInvalid] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const { id, date, description, amount } = transaction;

  const action = async (prevState: string | null, formdata: FormData) => {
    const actionResult = await actionTransaction(
      id,
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
          <div></div>

          <DateInputField
            label='Date'
            name='date'
            initialValue={convertDateToString(date)}
            setInvalid={setInvalid}
          />
        </div>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div className='col-span-3'>
            <TextInputField
              label='Description'
              name='description'
              placeholder=''
              initial={description || ''}
            />
          </div>
          <div className='col-start-4'>
            <NumberInputField
              label='Amount'
              name='amount'
              placeholder=''
              initial={convertNumberToString(amount)}
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

        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div className='col-start-4'>
            <CheckboxField label='Create new' name='noUpdate' />
          </div>
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
