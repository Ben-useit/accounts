export const calculateTax = (amount: number) => {
  amount = amount / 12;
  let taxAmount = 0;
  if (amount <= 150000) taxAmount = 0;
  else if (amount <= 2550000) taxAmount = (amount - 150000) * 0.3;
  else taxAmount = 2550000 * 0.3 + (amount - 2550000) * 0.35;
  return taxAmount * 12;
};
