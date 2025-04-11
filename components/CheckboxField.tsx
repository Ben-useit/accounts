const CheckboxField = ({ label, name }: { label: string; name: string }) => {
  return (
    <div>
      <input type='checkbox' name={name} className='inline-flex' />
      <label htmlFor='checkbox' className='pl-3 py-1.5 pr-3 text-gray-900'>
        {label}
      </label>
    </div>
  );
};
export default CheckboxField;
