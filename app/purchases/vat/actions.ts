'use server';

import { getAccount, transaction } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionVatPurchase = async (
  expensesId: number,
  creditId: number,
  formData: FormData
) => {
  const { date, description, amount, vat } = Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null) return 'Amount is not a valid number';

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null) return 'You entered an invalid date string';

  const vatNumber = convertStringToNumber(vat as string);
  if (vatNumber == null) return 'VAT is not a valid number';

  let data = {
    date: dateObj,
    amount: amountNumber,
    debitId: expensesId,
    creditId,
    description: description as string,
  };
  await transaction(data);

  if (vatNumber == 0) return 'Purchase booked';
  const vatAccountId = await getAccount({ name: 'VAT' });
  const note = description as string;
  data = {
    date: dateObj,
    amount: vatNumber,
    debitId: vatAccountId.id,
    creditId: expensesId,
    description: `${note} VAT`,
  };
  await transaction(data);
  return 'VAT purchase booked';
};
