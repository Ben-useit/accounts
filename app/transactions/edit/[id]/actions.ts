'use server';
import { createTransaction, updateTransaction } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';
import prisma from '@/utils/db';

export const getTransaction = async (id: number) => {
  const result = await prisma.transaction.findFirst({ where: { id: id } });
  return result;
};

export const actionTransaction = async (
  id: number,
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount, noUpdate, rate } =
    Object.fromEntries(formData);
  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null)
    return { error: true, message: 'Amount is not a valid number' };
  const rateNumber = convertStringToNumber(rate as string);
  if (rateNumber == null)
    return { error: true, message: 'Rate is not a valid number' };

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null)
    return { error: true, message: 'You entered an invalid date string' };
  const data = {
    date: dateObj,
    amount: amountNumber,
    rate: rateNumber,
    debitId: expensesId,
    creditId,
    description: description as string,
  };

  if (noUpdate) {
    await createTransaction(data);
    return {
      error: false,
      message: `New transaction ${description} processed`,
    };
  } else {
    await updateTransaction(id, data);
    return { error: false, message: `Transaction ${description} updated` };
  }
};
