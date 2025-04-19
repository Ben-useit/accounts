'use server';

import { getAccount, createTransaction, createInvoice } from '@/prisma/queries';
import { convertStringToDate, convertStringToNumber } from '@/utils/convert';

export const actionNewInvoice = async (
  clientId: number,
  vatVal: number,
  formData: FormData
) => {
  const { date, description, amount, reimbursement, openingBalance } =
    Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null)
    return { error: true, message: 'Amount is not a valid number' };

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null)
    return { error: true, message: 'You entered an invalid date string' };

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
  let account = await getAccount({ name: 'Receivables' });
  if (!account)
    return { error: true, message: 'Account <Receivables> does not exist.' };
  const debitId = account.id;

  let creditId: number;
  if (openingBalance) {
    account = await getAccount({ name: 'Opening Balance' });
    if (!account)
      return {
        error: true,
        message: 'Account <Opening Balance> does not exist.',
      };
    creditId = account.id;
  } else {
    if (reimbursement) {
      account = await getAccount({ name: 'Reimbursement' });
      if (!account)
        return {
          error: true,
          message: 'Account <Reimbursement> does not exist.',
        };
      creditId = account.id;
    } else {
      account = await getAccount({ name: 'Consulting' });
      if (!account)
        return {
          error: true,
          message: 'Account <Consulting> does not exist.',
        };
      creditId = account.id;
    }
  }

  account = await getAccount({ name: 'VAT' });
  if (!account)
    return {
      error: true,
      message: 'Account <VAT> does not exist.',
    };
  const vatId = account.id;

  let data = {
    date: dateObj,
    amount: amountNumber + vat,
    debitId,
    creditId,
    description: description as string,
    invoiceId: invoice.id,
  };
  await createTransaction(data);

  if (openingBalance || vat == 0)
    return { error: false, message: `Invoice ${description} proceeded` };

  data = {
    date: dateObj,
    amount: vat,
    debitId: creditId,
    creditId: vatId,
    description: `${description as string} VAT`,
    invoiceId: invoice.id,
  };
  await createTransaction(data);

  return { error: false, message: `Invoice ${description} proceeded` };
};
