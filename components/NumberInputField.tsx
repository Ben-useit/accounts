'use client';

import { useState } from 'react';

const NumberInputField = ({
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
  const [value, setValue] = useState<string>('');
  const validateInput = (e: { target: { value: string } }) => {
    const isNumber = validate(e.target.value);
    if (!isNumber) {
      setColor('outline-red-600 outline-2');
      setError('not a valid number');
    } else {
      setColor('outline-1 outline-gray-300');
      setError(null);
      const formattedNumber = convertStringToNumber(e.target.value);
      setValue(formattedNumber);
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
            onBlur={validateInput}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </div>
  );
};
export default NumberInputField;

const validate = (input: string) => {
  let numberString = input;
  if (numberString.startsWith('-')) {
    numberString = numberString.slice(1);
  }
  if (numberString.startsWith('-')) return false;
  //numberString = numberString.replace(/[^\d.]/g, '');
  numberString = numberString.replace(',', '');
  const number = Number(numberString);
  return number.toString() === 'NaN' ? false : true;
};
/**
 * Converts a given string into a number with thousands seperator.
 * Eleminates all characters that are not a number or "."
 *
 * @param value
 * @returns A string with seperator and decimal point: eg. 25,400.00
 */
const convertStringToNumber = (value: string): string => {
  // Remove all non-numeric characters except for the decimal point
  let numericValue = value.replace(/[^\d.-]/g, '');

  // Ensure there is only one decimal point and two digits after it
  const parts = numericValue.split('.');
  let hasDecimalPoint = false;
  if (parts.length > 2) {
    numericValue = parts[0] + '.' + parts[1].slice(0, 2); // Limit to two decimal places
    hasDecimalPoint = true;
  } else if (parts.length === 2) {
    numericValue = parts[0] + '.' + parts[1].slice(0, 2); // Limit to two decimal places
    hasDecimalPoint = true;
  }

  // Add commas to the integer part (before the decimal point)
  const integerPart = numericValue.split('.')[0];
  let decimalPart = numericValue.split('.')[1] || '';
  if (decimalPart.length == 0) decimalPart = '00';
  if (decimalPart.length == 1) decimalPart = `${decimalPart}0`;
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Combine the integer and decimal parts
  if (integerPart && hasDecimalPoint)
    return formattedInteger + '.' + decimalPart;
  else if (integerPart && !hasDecimalPoint) return `${formattedInteger}.00`;
  else if (!integerPart && hasDecimalPoint) return '.' + decimalPart;
  return '';
};
