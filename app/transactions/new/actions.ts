'use server';

import { transaction } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionTransaction = async (
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount } = Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null) return 'Amount is not a valid number';

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null) return 'You entered an invalid date string';
  const data = {
    date: dateObj,
    amount: amountNumber,
    debitId: expensesId,
    creditId,
    description: description as string,
  };
  await transaction(data);

  return 'Transaction processed';
};
