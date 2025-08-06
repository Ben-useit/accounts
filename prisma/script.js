const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// await prisma.card.updateMany({
//   where: {
//     userId: 'userID',
//   },
//   data: {
//     userId: 'user_2qzFAY5HCsy0nPCb7JwGC7LRwHv',
//   },
// });
//};

const main = async () => {
  const invoices = await prisma.invoice.findMany({});
  for (const invoice of invoices) {
    const transactions = await prisma.transaction.findMany({
      where: {
        invoiceId: invoice.id,
      },
      orderBy: [{ id: 'asc' }],
    });
    const amount = transactions[0].amount;
    console.log('date: ', invoice.id, transactions[0].date);
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        amount: amount,
        issued: transactions[0].date,
      },
    });
    //console.log(transactions[2].date);
    // if (transactions.length === 2)
    //   console.log(
    //     '-------------------------------- ERRRRRRROR ------------------------------------'
    //   );
    // else if (transactions.length === 3) console.log(transactions[2].date);
    // else if (transactions.length === 4) {
    //   console.log(invoice.id, transactions[2].date, transactions[3].date);
    //   if (transactions[2].date.toString() != transactions[3].date.toString())
    //     throw new Error('nix geht');
    // } else
    //   console.log(
    //     '-------------------------------- ERRRRRRROR > 4 ------------------------------------'
    //   );
  }
  //console.log(invoices);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
