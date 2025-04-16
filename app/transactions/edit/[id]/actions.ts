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
  const { date, description, amount, noUpdate } = Object.fromEntries(formData);
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

  if (noUpdate) await createTransaction(data);
  else await updateTransaction(id, data);

  return 'Transaction processed';
};
