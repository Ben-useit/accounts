export type InvoiceType = {
  id: number;
  name: string;
  paid: Date | null;
  issued: Date;
  amount: number;
};
