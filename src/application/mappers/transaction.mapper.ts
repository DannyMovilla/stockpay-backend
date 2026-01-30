import { Transaction } from 'src/domain/transaction/transaction.entity';

export class TransactionMapper {
  static toDomain(record: any): Transaction {
    return new Transaction(
      record.id,
      record.status,
      record.amount,
      record.base_fee,
      record.shipping_fee,
      record.total_amount,
      record.quantity,
      record.wompi_transaction_id,
      record.product_id,
      record.customer_id,
      record.created_at,
      record.updated_at,
    );
  }

  static toPersistence(transaction: Partial<Transaction>) {
    return {
      status: transaction.status,
      wompi_transaction_id: transaction.wompiTransactionId,
    };
  }
}
