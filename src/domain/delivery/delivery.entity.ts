export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'DELIVERED';

export class Delivery {
  constructor(
    public readonly id: string,
    public address: string,
    public city: string,
    public country: string,
    public status: DeliveryStatus,
    public transactionId: string,
  ) {}
}
