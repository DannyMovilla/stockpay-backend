import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRepository } from 'src/domain/delivery/delivery.repository';
import { ProductRepository } from 'src/domain/product/product.repository';
import {
  DELIVERY_REPOSITORY,
  PRODUCT_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from 'src/domain/tokens';
import { TransactionRepository } from 'src/domain/transaction/transaction.repository';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: TransactionRepository,

    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,

    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepo: DeliveryRepository,
  ) {}

  async execute(transactionId: string) {
    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const product = await this.productRepo.findById(transaction.productId);
    const delivery = await this.deliveryRepo.findByTransactionId(
      transaction.id,
    );

    return {
      id: transaction.id,
      status: transaction.status,
      totalAmount: transaction.totalAmount,
      product,
      delivery,
      createdAt: transaction.createdAt,
    };
  }
}
