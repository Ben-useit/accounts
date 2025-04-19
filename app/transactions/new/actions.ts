'use server';

import { createTransaction } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionTransaction = async (
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount } = Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
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

  return { error: false, message: `Transaction ${description} proceeded` };
};
