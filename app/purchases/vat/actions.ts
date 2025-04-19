'use server';

import { getAccount, createTransaction } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionVatPurchase = async (
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount, vat } = Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null)
    return { error: true, message: 'Amount is not a valid number' };

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null)
    return { error: true, message: 'You entered an invalid date string' };

  const vatNumber = convertStringToNumber(vat as string);
  if (vatNumber == null)
    return { error: true, message: 'VAT is not a valid number' };

  let data = {
    date: dateObj,
    amount: amountNumber,
    debitId: expensesId,
    creditId,
    description: description as string,
  };
  await createTransaction(data);

  if (vatNumber == 0)
    return { error: false, message: `Purchase ${description} proceeded` };
  const vatAccountId = await getAccount({ name: 'VAT' });
  if (!vatAccountId)
    return { error: true, message: 'VAT account does not exist.' };
  const note = description as string;
  data = {
    date: dateObj,
    amount: vatNumber,
    debitId: vatAccountId.id,
    creditId: expensesId,
    description: `${note} VAT`,
  };
  await createTransaction(data);
  return { error: false, message: `VAT Purchase ${description} proceeded` };
};
