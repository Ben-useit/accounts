'use server';

import { getAccount, transaction, createInvoice } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionNewInvoice = async (
  clientId: number,
  vatVal: number,
  formData: FormData
) => {
  const { date, description, amount, reimbursement, openingBalance } =
    Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null) return 'Amount is not a valid number';

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null) return 'You entered an invalid date string';

  let vat = 0;
  if (vatVal != 0) {
    const vatNumber = amountNumber * 0.165;
    vat = Number(vatNumber.toFixed(2));
  }
  // Create Invoice first
  const invoiceData = {
    name: description as string,
    clientId,
  };

  const invoice = await createInvoice(invoiceData);

  // Need two accounts: Receivable debit, Income or Reimbursement is credit
  // If openingBalance is checked use this instead
  let creditId: number;
  if (openingBalance) creditId = (await getAccount('Opening Balance')).id;
  else {
    creditId = reimbursement
      ? (await getAccount('Reimbursement')).id
      : (await getAccount('Consulting')).id;
  }
  const debitId = (await getAccount('Receivables')).id;
  let data = {
    date: dateObj,
    amount: amountNumber + vat,
    debitId,
    creditId,
    description: description as string,
    invoiceId: invoice.id,
  };
  await transaction(data);

  if (openingBalance || vat == 0) return 'Invoice booked';
  const vatId = (await getAccount('VAT')).id;

  data = {
    date: dateObj,
    amount: vat,
    debitId: creditId,
    creditId: vatId,
    description: `${description as string} VAT`,
    invoiceId: invoice.id,
  };
  await transaction(data);

  return 'Invoice booked';
};
