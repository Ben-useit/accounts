export const convertStringToNumber = (value: string) => {
  let numericValue = value.replace(/[^\d.-]/g, '');
  const number = Number(numericValue);
  return number.toString() === 'NaN' ? null : number;
};

export const convertStringToDate = (value: string) => {
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
