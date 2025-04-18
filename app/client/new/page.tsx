'use client';
import TextInputField from '@/components/TextInputField';
import TextAreaField from '@/components/TextAreaField';
import ButtonPanel from '@/components/ButtonPanel';
import { useState } from 'react';

const NewClientPage = () => {
  const [clientInput, setClientInput] = useState('');
  return (
    <form>
      <div className='text-2xl'>Add a new client</div>
      <div className='mt-2'>
        {' '}
        <TextInputField
          label='Client Name'
          name='name'
          placeholder='Enter client name'
          value={clientInput}
          onChange={(e) => setClientInput(e.target.value)}
        />
      </div>
      <div className='mt-3'>
        {' '}
        <TextAreaField
          label='Address'
          name='address'
          rows={5}
          placeholder='Enter address'
        />
      </div>
      <div className='border-b mt-6 border-gray-300'></div>
      <ButtonPanel label='submit' cancelButton={false} />
    </form>
  );
};
export default NewClientPage;
