import { Delivery } from 'src/domain/delivery/delivery.entity';

export class DeliveryMapper {
  static toDomain(record: any): Delivery {
    return new Delivery(
      record.id,
      record.address,
      record.city,
      record.country,
      record.transaction_id,
      record.status,
    );
  }

  static toPersistence(delivery: Omit<Delivery, 'id'>) {
    return {
      address: delivery.address,
      city: delivery.city,
      country: delivery.country,
      transaction_id: delivery.transactionId,
      status: delivery.status,
    };
  }
}
