'use client';

import { useState } from 'react';

const DateInputField = ({
  label,
  placeholder = '',
  name,
  type = 'text',
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState('outline-1 outline-gray-300');
  const validateInput = (e: { target: { value: string } }) => {
    const result = convertStringToDate(e.target.value);
    if (!result) {
      setColor('outline-red-600 outline-2');
      setError('not a valid date');
    } else {
      setColor('outline-1 outline-gray-300');
      setError(null);
    }
  };
  return (
    <div className=''>
      <label htmlFor='name' className='block text-gray-900'>
        {label}:{' '}
        {error && <span className='text-red-600 text-sm'>{error}</span>}
      </label>
      <div className='mt-1'>
        <div
          className={`rounded-md bg-white pl-3 -outline-offset-1 ${color} focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600`}
        >
          <input
            type={type}
            name={name}
            id={name}
            className={`w-full py-1.5 pr-3 pl-1 text-gray-900  placeholder:text-gray-400 focus:outline-none sm:text-sm/6`}
            placeholder={placeholder}
            defaultValue={getDateString()}
            onBlur={validateInput}
          />
        </div>
      </div>
    </div>
  );
};
export default DateInputField;

const convertStringToDate = (value: string) => {
  if (!value || value === '') return null;

  const parts = value.split('/');
  if (parts.length != 3) return null;
  //YYYY-MM-DD
  if (parts[2].length != 4) return null;
  if (parts[1].length != 2) return null;
  if (parts[0].length != 2) return null;
  const dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
  const date = new Date(dateString);
  return date.toString() === 'Invalid Date' ? null : date;
};

const getDateString = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};
