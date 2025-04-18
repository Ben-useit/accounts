/**
 *
 * @param value - number e.g 100200.1
 * @returns - a number 100,200.10
 */
export const convertNumberToString = (value: number): string => {
  const formattedNumber = new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
  return formattedNumber;
};
export const convertStringToNumber = (value: string) => {
  let numericValue = value.replace(/,/g, '');
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

export const convertDateToString = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for the day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for the month (0-based index)
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
