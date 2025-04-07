'use server';

export const actionNewInvoice = async (
  clientId: number,
  vatVal: number,
  formData: FormData
) => {
  console.log('actionNewInvoice');
  const { date, description, amount, reimbursement } =
    Object.fromEntries(formData);
  const isReimbursment = reimbursement ? true : false;

  return `Server action: ClientId: ${clientId} VAT:${vatVal} ${date} ${description} ${amount} ${isReimbursment}`;
};
