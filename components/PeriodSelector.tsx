'use client';
import { useState } from 'react';

const PeriodSelector = ({
  initialFrom,
  initialTo,
  action,
}: {
  initialFrom: string;
  initialTo: string;
  action: ({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) => void;
}) => {
  const [invalid, setInvalid] = useState(false);
  const formAction = async (formData: FormData) => {
    const data = Object.fromEntries(formData);
    const dateFrom = data.dateFrom as string;
    const dateTo = data.dateTo as string;
    action({ dateFrom, dateTo });
  };
  const submitButtonStyle =
    'rounded-md  px-3 py-2 text-sm  text-white shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';
  return (
    <form action={formAction}>
      <div className='grid grid-cols-3 gap-2'>
        <DateInputField
          name='dateFrom'
          initialValue={initialFrom}
          setInvalid={setInvalid}
        />
        <DateInputField
          name='dateTo'
          initialValue={initialTo}
          setInvalid={setInvalid}
        />
        <button
          type='submit'
          disabled={invalid}
          className={
            invalid
              ? `${submitButtonStyle} bg-gray-300`
              : `${submitButtonStyle} bg-indigo-600 hover:bg-indigo-500`
          }
        >
          Submit
        </button>
      </div>
    </form>
  );
};
export default PeriodSelector;

const DateInputField = ({
  label,
  name,
  initialValue,
  setInvalid,
}: {
  label?: string;
  name: string;
  initialValue?: string;
  setInvalid: (arg: boolean) => void;
}) => {
  const iValue = validateString(initialValue || '');
  const [value, setValue] = useState(iValue);
  const [outline, setOutline] = useState('outline-1 outline-gray-300');

  const onBlur = (e: { target: { value: string } }) => {
    const v = validateString(e.target.value);
    if (v === 'Invalid Date') {
      setInvalid(true);
      setOutline('outline-2 outline-red-600');
    } else setValue(v);
  };
  return (
    <div>
      {label && (
        <label htmlFor='name' className='block text-gray-900'>
          {label}
        </label>
      )}
      <div
        className={`rounded-md ${outline} focus-within:-outline-offset-2 focus-within:outline-2 focus-within:outline-indigo-600`}
      >
        <input
          type='text'
          onBlur={onBlur}
          className='w-full focus:outline-0 py-1.5 pr-3 pl-1 text-gray-900'
          value={value}
          name={name}
          onChange={(e) => {
            setOutline('outline-1 outline-gray-300');
            setInvalid(false);
            setValue(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

const validateString = (value: string): string => {
  const today = new Date();
  let dd = today.getDate().toString();
  if (dd.length == 1) dd = `0${dd}`;
  let mm = (today.getMonth() + 1).toString();
  if (mm.length == 1) mm = `0${mm}`;
  let yyyy = today.getFullYear().toString();
  const parts = value.split('/');
  if (parts.length > 3) return 'Invalid Date';
  //length:1
  if (parts.length == 1) {
    const n = Number(parts[0]);
    if (n.toString() == 'NaN' || parts[0].length > 2) return 'Invalid Date';
    if (parts[0].length == 1) dd = `0${parts[0]}`;
    if (parts[0].length == 2) dd = `${parts[0]}`;
    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    if (dateObj.toString() == 'Invalid Date') return 'Invalid Date';
    return `${dd}/${mm}/${yyyy}`;
  }
  if (parts.length == 2) {
    let n = Number(parts[0]);
    if (n.toString() == 'NaN' || parts[0].length > 2) return 'Invalid Date';
    if (parts[0].length == 1) dd = `0${parts[0]}`;
    if (parts[0].length == 2) dd = `${parts[0]}`;

    n = Number(parts[1]);
    if (n.toString() == 'NaN' || parts[1].length > 2) return 'Invalid Date';
    if (parts[1].length == 1) mm = `0${parts[1]}`;
    if (parts[1].length == 2) mm = `${parts[1]}`;
    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    if (dateObj.toString() == 'Invalid Date') return 'Invalid Date';
    return `${dd}/${mm}/${yyyy}`;
  }
  if (parts.length == 3) {
    let n = Number(parts[0]);
    if (n.toString() == 'NaN' || parts[0].length > 2) return 'Invalid Date';
    if (parts[0].length == 1) dd = `0${parts[0]}`;
    if (parts[0].length == 2) dd = `${parts[0]}`;

    n = Number(parts[1]);
    if (n.toString() == 'NaN' || parts[1].length > 2) return 'Invalid Date';
    if (parts[1].length == 1) mm = `0${parts[1]}`;
    if (parts[1].length == 2) mm = `${parts[1]}`;

    n = Number(parts[2]);
    if (
      n.toString() == 'NaN' ||
      parts[2].length == 1 ||
      parts[2].length == 3 ||
      parts[2].length > 4
    )
      return 'Invalid Date';
    const part = yyyy.slice(0, 2);
    if (parts[2].length == 2) yyyy = `${part}${parts[2]}`;
    if (parts[2].length == 4) yyyy = `${parts[2]}`;

    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    if (dateObj.toString() == 'Invalid Date') return 'Invalid Date';
    return `${dd}/${mm}/${yyyy}`;
  }
  return 'Invalid Date';
};
