const ButtonPanel = ({
  cancelButton = false,
  cancelAction,
  label,
}: {
  cancelButton?: boolean;
  cancelAction?: () => void;
  label: string;
}) => {
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
        className='rounded-md bg-indigo-600 px-3 py-2 text-sm  text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      >
        {label}
      </button>
    </div>
  );
};
export default ButtonPanel;
