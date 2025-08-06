import { getBalances } from '@/actions';
import { getPeriodAsDate } from '@/prisma/queries';
import InvoicesList from './component';
import { type InvoiceType } from '@/types';
import prisma from '@/utils/db';
import { convertDateToString } from '@/utils/convert';

const UnpaidInvoices = async () => {
  const { periodEnd } = await getPeriodAsDate();
  const periodStart = new Date('2000/01/01');

  const result = await prisma.invoice.findMany({
    where: {
      issued: { lte: periodEnd },
      OR: [{ paid: null }, { paid: { gt: periodEnd } }],
    },
    orderBy: [{ clientId: 'asc' }, { id: 'asc' }],
  });

  const invoices: InvoiceType[] = result.map((i) => ({
    id: i.id,
    name: i.name,
    paid: i.paid,
    issued: i.issued,
    amount: i.amount.toNumber(),
  }));
  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount,
    0
  );

  // Deduct VAT liablities
  const { total: includedVat } = await getBalances(
    { type: 'LIABILITIES', name: 'VAT', currency: 'MWK' },
    { periodStart, periodEnd }
  );

  const { total: includedNoEFDVat } = await getBalances(
    { type: 'LIABILITIES', name: 'VAT (no EFD)', currency: 'MWK' },
    { periodStart, periodEnd }
  );

  return (
    <>
      <div className='lg:w-3/4'>
        <div className='text-2xl mb-4'>
          Unpaid Invoices until {convertDateToString(periodEnd)}
        </div>
        <InvoicesList
          invoices={invoices}
          grossBalance={totalAmount}
          includedVat={includedVat * -1}
          includedNoEFDVat={includedNoEFDVat * -1}
        />
      </div>
    </>
  );
};

export default UnpaidInvoices;
