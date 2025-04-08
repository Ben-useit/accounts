'use client';

import { useState, useEffect } from 'react';

const TextInputField = ({
  label,
  placeholder = '',
  name,
  type = 'text',
  initial = '',
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  initial?: string;
}) => {
  const [value, setValue] = useState<string>(initial);
  useEffect(() => setValue(initial), [initial]);
  return (
    <div className=''>
      <label htmlFor='name' className='block text-gray-900'>
        {label}:
      </label>
      <div className='mt-1'>
        <div className='rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
          <input
            type={type}
            name={name}
            id={name}
            className='w-full py-1.5 pr-3 pl-1 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6'
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
export default TextInputField;
