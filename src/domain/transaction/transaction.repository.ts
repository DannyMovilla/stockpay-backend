import { Transaction, TransactionStatus } from './transaction.entity';

export interface TransactionRepository {
  create(input: {
    status: TransactionStatus;
    amount: number;
    baseFee: number;
    shippingFee: number;
    totalAmount: number;
    quantity: number;
    productId: string;
    customerId: string;
  }): Promise<Transaction>;

  findById(id: string): Promise<Transaction | null>;

  updateStatus(
    id: string,
    status: TransactionStatus,
    wompiTransactionId?: string,
  ): Promise<void>;
}
