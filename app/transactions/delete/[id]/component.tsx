'use client';
import { convertDateToString, convertNumberToString } from '@/utils/convert';
import ButtonPanel from '@/components/ButtonPanel';
import { actionDelete, type ResultType } from './actions';

const DeleteConfirm = ({
  id,
  props,
  redirectTo,
}: {
  id: string;
  props: ResultType;
  redirectTo: string;
}) => {
  const { invoice, transactions, clientName } = props;
  const gridStyle = 'grid-cols-[1fr_4fr_2fr_2fr_1fr]';
  const onClick = () => {
    actionDelete(props, redirectTo);
  };
  return (
    <div className='lg:w-3/4'>
      <div className='text-2xl mb-4'>Delete Transaction No.{id}</div>
      {invoice && (
        <>
          <div className='text-xl'>
            {' '}
            This transaction is part of the following invoice:
          </div>
          <div className={`grid ${gridStyle} gap-4 font-semibold`}>
            <div>Date</div>
            <div>Description</div>
            <div>Client</div>
            <div></div>
            <div>Amount</div>
          </div>
          <div className={`grid ${gridStyle} gap-4 mb-4`}>
            <div>{convertDateToString(transactions[0].date)}</div>
            <div>{invoice.name}</div>
            <div>{clientName}</div>
            <div></div>
            <div>{convertNumberToString(transactions[0].amount)}</div>
          </div>
          <div className='text-2xl mb-4'>
            Transactions related to the invoice
          </div>
        </>
      )}

      <div className={`grid ${gridStyle} gap-4 font-semibold`}>
        <div>Date</div>
        <div>Description</div>
        <div>Debit</div>
        <div>Credit</div>
        <div>Amount</div>
      </div>
      {transactions.map((t, index) => {
        const { date, description, debit, credit } = t;
        return (
          <div className={`grid ${gridStyle} gap-4`} key={index}>
            <div>{convertDateToString(date)}</div>
            <div>{description}</div>
            <div>{debit.name}</div>
            <div>{credit.name}</div>
            <div>{convertNumberToString(t.amount)}</div>
          </div>
        );
      })}
      <div className={`grid ${gridStyle} gap-4`}>
        <div className='col-start-5'>
          <ButtonPanel
            cancelButton={true}
            label='Delete'
            btnColor='red'
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirm;
