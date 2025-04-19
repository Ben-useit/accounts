'use client';

import ButtonPanel from '@/components/ButtonPanel';
import { DateInputField } from '@/components/DateComponent';
import NumberInputField from '@/components/NumberInputField';
import Select from '@/components/Select';
import TextInputField from '@/components/TextInputField';
import { useActionState, useState } from 'react';
import { actionInvoicePayment, getInvoiceDetails } from './actions';
import CheckboxField from '@/components/CheckboxField';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';

const Form = ({ invoices }: { invoices: { id: number; name: string }[] }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [invoiceId, setInvoiceId] = useState(1);
  const [wht, setWht] = useState(3);
  const [descInput, setDescInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [vatInput, setVatInput] = useState('');
  const handleInvoiceSelect = async (invoiceId: number) => {
    setInvoiceId(invoiceId);
    const result = await getInvoiceDetails(invoiceId);
    if (!result) {
      setErrorMessage('There was an error retreiving data.');
      return;
    }
    const { amount, vat, description } = result;
    setAmountInput(amount);
    setVatInput(vat);
    setDescInput(description);
  };
  const action = async (prevState: string | null, formdata: FormData) => {
    const { error, message } = await actionInvoicePayment(
      invoiceId,
      wht,
      formdata
    );

    if (error) toast.error(message);
    else {
      toast.success(message);
      redirect('/sales/payment');
    }
    return '';
  };
  const cancelAction = () => {};
  const [message, formAction] = useActionState(action, null);
  const [invalid, setInvalid] = useState(false);
  const [dateInput, setDateInput] = useState('');
  return (
    <>
      <div className='text-2xl'>Invoice Payment</div>
      {message && <div className='text-xl'>{message}</div>}
      {errorMessage && <div className='text-xl'>{errorMessage}</div>}
      <form action={formAction}>
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
          <div className='col-start-4'>
            <CheckboxField label='already includes VAT' name='vatIncluded' />
          </div>
          <div className='col-start-4'>
            <NumberInputField
              label='VAT'
              name='vat'
              placeholder=''
              value={vatInput}
              setValue={setVatInput}
              onChange={(e) => setVatInput(e.target.value)}
              setInvalid={setInvalid}
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
