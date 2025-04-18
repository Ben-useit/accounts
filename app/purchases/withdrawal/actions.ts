'use server';

import { createTransaction } from '@/prisma/queries';
import {
  convertNumberToString,
  convertStringToDate,
  convertStringToNumber,
} from '@/utils/convert';

export const actionWithdrawal = async (
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount } = Object.fromEntries(formData);
  console.log('in actions: amount:', amount);

  const amountNumber = convertStringToNumber(amount as string);
  console.log('after convert:', amountNumber);

  if (amountNumber == null)
    return { error: true, message: 'Amount is not a valid number' };

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null)
    return { error: true, message: 'You entered an invalid date string' };
  const data = {
    date: dateObj,
    amount: amountNumber,
    debitId: expensesId,
    creditId,
    description: description as string,
  };
  await createTransaction(data);
  convertNumberToString(amountNumber);
  return {
    error: false,
    message: `${convertNumberToString(amountNumber)} processed!`,
  };
};
