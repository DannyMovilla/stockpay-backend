import { Delivery } from './delivery.entity';

export interface DeliveryRepository {
  create(input: {
    address: string;
    city: string;
    country: string;
    transactionId: string;
  }): Promise<Delivery>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
}
