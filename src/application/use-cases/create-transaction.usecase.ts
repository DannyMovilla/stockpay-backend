import { Inject, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/product/product.repository';
import { CustomerRepository } from '../../domain/customer/customer.repository';
import { TransactionRepository } from '../../domain/transaction/transaction.repository';
import { DeliveryRepository } from '../../domain/delivery/delivery.repository';
import { ProductNotFoundError } from 'src/shared/errors';
import {
  CUSTOMER_REPOSITORY,
  DELIVERY_REPOSITORY,
  PRODUCT_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from 'src/domain/tokens';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: ProductRepository,

    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepo: CustomerRepository,

    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepo: TransactionRepository,

    @Inject(DELIVERY_REPOSITORY)
    private readonly deliveryRepo: DeliveryRepository,
  ) {}

  async execute(input: CreateTransactionDto) {
    const product = await this.productRepo.findById(input.productId);
    if (!product || product.stock <= 0) {
      throw new ProductNotFoundError();
    }

    let customer = await this.customerRepo.findByEmail(input.email);
    if (!customer) {
      customer = await this.customerRepo.create({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
      });
    }

    const transaction = await this.transactionRepo.create({
      status: 'PENDING',
      amount: product.price,
      quantity: input.quantity,
      baseFee: input.baseFee,
      shippingFee: input.shippingFee,
      totalAmount: input.totalAmount,
      productId: product.id,
      customerId: customer.id,
    });

    await this.deliveryRepo.create({
      address: input.address,
      city: input.city,
      country: input.country,
      transactionId: transaction.id,
    });

    return transaction;
  }
}
