// import { getIncomplete, getInvoices } from '@/prisma/queries';
// import { getInvoiceDetails } from '../sales/payment/actions';
// import { convertStringToNumber } from '@/utils/convert';
// import prisma from '@/utils/db';
//import { processFile } from '@/utils/text';
const Test = async () => {
  //await processFile('/home/ben/Downloads/CashExport2.csv');
  return <div>Nix</div>;

  //await getIncomplete();
  // const z = await getInvoices();
  // z.forEach(async (i) => {
  //   const aa = await getInvoiceDetails(i.id);
  //   if (aa) {
  //     let amount = convertStringToNumber(aa.amount) || 0;
  //     const invoiceAmount = amount;
  //     let wht = 0;
  //     let vat = convertStringToNumber(aa.vat) || 0;

  //     //const xa = convertStringToNumber(aa.vat);
  //     if (vat == 0) {
  //       // deduct vat from amount
  //       console.log('deduct.........');
  //       const deducted = Number((amount / 1.165).toFixed(2));
  //       vat = amount - deducted;
  //       amount = deducted;
  //       //amount = Number(amount) - vat;
  //     }
  //     if (!aa.description.startsWith('Savjani')) {
  //       wht = amount * 0.2;
  //       amount = Number(amount) - wht;
  //     }
  //     console.log(
  //       aa.description,
  //       invoiceAmount,
  //       'Receivable: ',
  //       invoiceAmount + vat
  //     );
  //     // console.log('payment: ', amount + vat, 'wht: ', wht, 'vat: ', vat);
  //     // console.log('payment + wht: ', amount + vat + wht);
  //     // console.log('------------');
  //     const tt = await prisma.transaction.findFirst({
  //       where: { invoiceId: i.id, debitId: 1, creditId: 2 },
  //     });

  //     if (!tt) console.log('Nix zu dun...tt:', tt);
  //     console.log('tt: ', tt);

  //     if (tt) {
  //       console.log('Mach was ..........................');

  //       await prisma.transaction.update({
  //         where: { id: tt.id },
  //         data: {
  //           amount: amount + vat,
  //           description: `${aa.description} payment`,
  //         },
  //       });
  //       if (wht > 0) {
  //         await prisma.transaction.create({
  //           data: {
  //             date: tt.date,
  //             amount: wht,
  //             debitId: 6,
  //             creditId: 2,
  //             description: `${aa.description} WHT deduction`,
  //             invoiceId: tt.invoiceId,
  //           },
  //         });
  //       }
  //       await prisma.invoice.update({
  //         where: { id: i.id },
  //         data: { payed: true },
  //       });
  //     }
  //     console.log('---- xxx --------');
  //   }
  // });

  // return (
  //   <>
  //     <div className='grid grid-cols-4'>TEST</div>
  //   </>
  // );
};
export default Test;
