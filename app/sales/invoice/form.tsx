'use client';
import { actionNewInvoice } from '@/actions';
import ButtonPanel from '@/components/ButtonPanel';
import DateInputField from '@/components/DateInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';

const clients = [
  { id: 1, name: 'Macsteel' },
  { id: 2, name: 'Cure' },
  { id: 3, name: 'Imani' },
  { id: 4, name: 'Savjani' },
];
const Form = () => {
  const [clientId, setClientId] = useState(1);
  const [vatVal, setVatVal] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const action = async (prevState: string | null, formdata: FormData) => {
    const actionResult = await actionNewInvoice(clientId, vatVal, formdata);
    return actionResult;
  };
  const cancelAction = () => {
    formRef.current?.reset();
  };
  const [message, formAction] = useActionState(action, null);
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
            <TextInputField label='Amount' name='amount' placeholder='' />
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
                { id: 16.5, name: '16.5 %' },
              ]}
            />
          </div>
        </div>
        <div className='mt-6 grid grid-cols-5  gap-4'>
          <div className='col-start-1 col-span-5 flex justify-end'>
            <input
              type='checkbox'
              name='reimbursement'
              className='inline-flex'
            />
            <label
              htmlFor='checkbox'
              className='pl-3 py-1.5 pr-3 text-gray-900'
            >
              Reimbursement Invoice
            </label>
          </div>
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
