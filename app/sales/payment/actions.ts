'use server';
import prisma from '@/utils/db';

import { getAccount, transaction } from '@/prisma/queries';
import {
  convertDateToString,
  convertNumberToString,
  convertStringToDate,
  convertStringToNumber,
} from '@/utils/convert';
import { redirect } from 'next/navigation';

export const getInvoiceDetails = async (invoicedId: number) => {
  let data = await prisma.transaction.findFirst({
    where: {
      invoiceId: invoicedId,
      debit: {
        name: 'Receivables',
      },
    },
  });
  if (!data) return false;
  let amount = Number(data.amount);
  let vat = 0;
  const date = data.date;
  const description = data.description;
  // VAT
  data = await prisma.transaction.findFirst({
    where: {
      invoiceId: invoicedId,
      credit: {
        name: 'VAT',
      },
    },
  });
  if (data) {
    vat = Number(data.amount);
    amount = amount - vat;
  }

  return {
    amount: convertNumberToString(amount),
    date: convertDateToString(date),
    description: description ? description : '',
    vat: convertNumberToString(vat),
  };
};

export const actionInvoicePayment = async (
  invoiceId: number,
  wht: number,
  formData: FormData
) => {
  const { date, description, amount, vatIncluded } =
    Object.fromEntries(formData);

  const amountNumber = convertStringToNumber(amount as string);
  if (amountNumber == null) return 'Amount is not a valid number';

  const dateObj = convertStringToDate(date as string);
  if (dateObj == null) return 'You entered an invalid date string';

  const debitId = (await getAccount({ name: 'Standard Bank' })).id;
  const creditId = (await getAccount({ name: 'Receivables' })).id;

  let whtAmount = 0;
  if (wht > 0) {
    if (vatIncluded) {
      const netAmount = Number((amountNumber / 1.165).toFixed(2));
      whtAmount = netAmount * wht;
    } else {
      whtAmount = amountNumber * wht;
      whtAmount = Number(whtAmount.toFixed(2));
    }
  }
  let data = {
    date: dateObj,
    amount: amountNumber - whtAmount,
    debitId,
    creditId,
    description: `${description as string} payment`,
    invoiceId: invoiceId,
  };
  await transaction(data);
  await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      payed: true,
    },
  });
  if (wht == 0) return 'Payment processed';

  const whtAccountId = (await getAccount({ name: 'WHT Deducted' })).id;
  data = {
    date: dateObj,
    amount: whtAmount,
    debitId: whtAccountId,
    creditId,
    description: `${description as string} payment (WHT deducted)`,
    invoiceId: invoiceId,
  };
  await transaction(data);

  redirect('/sales/payment');
  return 'Payment processed';
};
