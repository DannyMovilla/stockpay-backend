export type TransactionStatus = 'PENDING' | 'APPROVED' | 'FAILED';

export class Transaction {
  constructor(
    public readonly id: string,
    public status: TransactionStatus,
    public amount: number,
    public baseFee: number,
    public shippingFee: number,
    public totalAmount: number,
    public quantity: number,
    public wompiTransactionId: string | null,
    public productId: string,
    public customerId: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
