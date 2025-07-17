export const calculateTax = (
  amount: number,
  periodStart: Date,
  periodEnd: Date
) => {
  return amount * 0.3;
  // const months = getMonthDifference(periodStart, periodEnd);
  // console.log('Months: ', months);
  // amount = amount / months;
  // let taxAmount = 0;
  // if (amount <= 150000) taxAmount = 0;
  // else if (amount <= 2550000) taxAmount = (amount - 150000) * 0.3;
  // else taxAmount = 2550000 * 0.3 + (amount - 2550000) * 0.35;
  // return taxAmount * months;
};

function getMonthDifference(periodStart: Date, periodEnd: Date) {
  // If dateB's day is less than dateA's day, subtract one month
  if (periodEnd.getDate() < periodStart.getDate()) {
    throw new Error('The start date of the period is set after the end date.');
  }
  const yearDiff = periodEnd.getFullYear() - periodStart.getFullYear();
  console.log('yearDiff: ', yearDiff);
  const monthDiff = periodEnd.getMonth() - periodStart.getMonth();
  console.log('monthDiff: ', monthDiff);
  let totalMonths = yearDiff * 12 + monthDiff;
  if (totalMonths === 0) return 1;

  return totalMonths;
}
