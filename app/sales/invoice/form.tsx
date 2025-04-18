'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';
import { actionNewInvoice } from './actions';
import CheckboxField from '@/components/CheckboxField';

const Form = ({ clients }: { clients: { id: number; name: string }[] }) => {
  const [clientId, setClientId] = useState(1);
  const [vatVal, setVatVal] = useState(2);
  const [descInput, setDescInput] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const action = async (prevState: string | null, formdata: FormData) => {
    const actionResult = await actionNewInvoice(clientId, vatVal, formdata);
    return actionResult;
  };
  const cancelAction = () => {
    formRef.current?.reset();
  };
  const [message, formAction] = useActionState(action, null);
  const [invalid, setInvalid] = useState(false);
  return (
    <>
      <div className='text-2xl'>New Invoice</div>
      {message && <div className='text-xl'>{message}</div>}
      <form action={formAction} ref={formRef}>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div></div>
          <div></div>
          <Select
            label='Client'
            defaultEntry={clientId}
            style='w-full'
            entries={clients}
            onSelect={setClientId}
          />

          {/* </div>
        <div className='mt-2 grid grid-cols-4  gap-4'> */}
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
        <div className='mt-6 grid grid-cols-5  gap-4'>
          <div className='col-start-1 col-span-5 flex justify-end'>
            <Select
              label='Add Vat:  '
              btnLabel='Select VAT'
              defaultEntry={vatVal}
              position='inline'
              style='w-[150px]'
              onSelect={setVatVal}
              entries={[
                { id: 0, name: '0.0 %' },
                { id: 0.165, name: '16.5 %' },
              ]}
            />
          </div>
        </div>
        <div className='mt-6 grid grid-cols-5  gap-4'>
          <div className='col-start-1 col-span-5 flex justify-end'>
            <CheckboxField label='Reimbursement Invoice' name='reimbursement' />
            {/* <input
              type='checkbox'
              name='reimbursement'
              className='inline-flex'
            />
            <label
              htmlFor='checkbox'
              className='pl-3 py-1.5 pr-3 text-gray-900'
            >
              Reimbursement Invoice
            </label> */}
          </div>
        </div>
        <div className='mt-6 grid grid-cols-5  gap-4'>
          <div className='col-start-1 col-span-5 flex justify-end'>
            <CheckboxField label='As opening balance' name='openingBalance' />
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
