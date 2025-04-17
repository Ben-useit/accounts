'use client';
import { useEffect, useState } from 'react';
const ButtonPanel = ({
  cancelButton = false,
  cancelAction,
  label,
  invalid = false,
  btnColor = 'indigo',
  onClick,
}: //setInvalid
{
  cancelButton?: boolean;
  cancelAction?: () => void;
  label: string;
  //setInvalid: (arg: boolean) => void;
  invalid?: boolean;
  btnColor?: string;
  onClick?: () => void;
}) => {
  const [isInvalid, setIsInvalid] = useState(!invalid);
  useEffect(() => {
    setIsInvalid(!isInvalid);
  }, [invalid]);
  const submitButtonStyle =
    'rounded-md  px-3 py-2 text-sm  text-white shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

  return (
    <div className='grid grid-cols-[70px_70px] mt-6 gap-x-8 justify-end'>
      {cancelButton ? (
        <button
          type='button'
          onClick={cancelAction}
          className='rounded-md bg-gray-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
        >
          Cancel
        </button>
      ) : (
        <div></div>
      )}

      <button
        type='submit'
        disabled={isInvalid}
        onClick={onClick}
        className={
          isInvalid
            ? `${submitButtonStyle} bg-gray-300`
            : `${submitButtonStyle} bg-${btnColor}-600 hover:bg-${btnColor}-500`
        }
        //className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        {label}
      </button>
    </div>
  );
};
export default ButtonPanel;
