'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState, useRef } from 'react';
import { actionInvoicePayment, getInvoiceDetails } from './actions';
import CheckboxField from '@/components/CheckboxField';

const Form = ({ invoices }: { invoices: { id: number; name: string }[] }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [invoiceId, setInvoiceId] = useState(1);
  const [wht, setWht] = useState(3);
  const [amount, setAmount] = useState('');
  const [vat, setVat] = useState('');
  const [description, setDescription] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleInvoiceSelect = async (invoiceId: number) => {
    setInvoiceId(invoiceId);
    const result = await getInvoiceDetails(invoiceId);
    if (!result) {
      setErrorMessage('There was an error retreiving data.');
      return;
    }
    const { amount, vat, description } = result;
    setAmount(amount);
    setVat(vat);
    setDescription(description);
  };
  const action = async (prevState: string | null, formdata: FormData) => {
    const actionResult = await actionInvoicePayment(invoiceId, wht, formdata);
    return actionResult;
  };
  const cancelAction = () => {
    formRef.current?.reset();
  };
  const [message, formAction] = useActionState(action, null);
  const [invalid, setInvalid] = useState(false);
  return (
    <>
      <div className='text-2xl'>Invoice Payment</div>
      {message && <div className='text-xl'>{message}</div>}
      {errorMessage && <div className='text-xl'>{errorMessage}</div>}
      <form action={formAction} ref={formRef}>
        <div className='mt-2 grid grid-cols-4  gap-4'>
          <div></div>
          <div></div>
          <Select
            label='Invoice'
            defaultEntry={invoiceId}
            style='w-full'
            entries={invoices}
            onSelect={(e) => handleInvoiceSelect(e)}
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
              initial={description}
            />
          </div>
          <div className='col-start-4'>
            <NumberInputField
              label='Amount'
              name='amount'
              placeholder=''
              initial={amount}
            />
          </div>
          <div className='col-start-4'>
            <CheckboxField label='already includes VAT' name='vatIncluded' />
          </div>
          <div className='col-start-4'>
            <NumberInputField
              label='VAT'
              name='vat'
              placeholder=''
              initial={vat}
            />
          </div>
        </div>
        <div className='mt-6 grid grid-cols-5  gap-4'>
          <div className='col-start-1 col-span-5 flex justify-end'>
            <Select
              label='Deducted WHT:  '
              btnLabel='WHT'
              defaultEntry={wht}
              position='inline'
              style='w-[150px]'
              onSelect={setWht}
              entries={[
                { id: 0, name: '0 %' },
                { id: 0.03, name: '3 %' },
                { id: 0.2, name: '20 %' },
              ]}
            />
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
