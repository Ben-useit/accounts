'use client';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export type DropDownType = {
  id: number;
  name: string;
};

const divStyle =
  'rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600';

const Select = ({
  entries,
  style,
  label,
  defaultEntry,
  btnLabel = '',
  onSelect,
  position = 'block',
}: {
  entries: DropDownType[];
  style: string;
  label?: string;
  defaultEntry?: number;
  btnLabel?: string;
  position?: string;
  onSelect: (arg: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const preSelected = defaultEntry
    ? entries[defaultEntry - 1]
    : { id: -1, name: btnLabel };

  const [selectedOption, setSelectedOption] =
    useState<DropDownType>(preSelected);
  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectItem = (option: DropDownType) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) onSelect(option.id); // Propagate the selected option up
  };

  return (
    <div className={`inline relative`}>
      <label
        htmlFor={label}
        className={label ? `${position} text-gray-900` : 'invisible'}
      >
        {label ? `${label}:` : 'label'}
      </label>
      <div
        className={`${style} ${divStyle} ${position} h-9 mt-1 cursor-pointer p-2 text-right`}
        onClick={toggleDropdown}
      >
        {selectedOption?.name}
        <ChevronDownIcon className='inline' height={20} />
      </div>

      {isOpen && (
        <ul
          className={`absolute ${style} ${divStyle} max-h-44 overflow-y-auto z-20 bg1-indigo-100 right-0`}
        >
          {entries.map((entry, index) => {
            return (
              <li
                key={index}
                onClick={() => selectItem(entry)}
                className={`pr-6 p-2.5 cursor-pointer hover:bg-indigo-200 text-right`}
              >
                {entry.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
