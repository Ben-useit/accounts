export const calculateTax = (amount: number) => {
  let taxAmount = 0;
  if (amount <= 150000) taxAmount = 0;
  else if (amount <= 500000) taxAmount = (amount - 150000) * 0.25;
  else if (amount <= 2550000)
    taxAmount = 350000 * 0.25 + (amount - 500000) * 0.3;
  else taxAmount = 350000 * 0.25 + 2050000 * 0.3 + (amount - 2550000) * 0.35;
  return taxAmount;
};
