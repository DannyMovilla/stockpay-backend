import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/transaction/transaction.repository';
import { WompiAdapter } from '../../infrastructure/wompi/wompi.adapter';
import { PaymentDto } from '../dto/payment.dto';
import { ProductRepository } from 'src/domain/product/product.repository';
import { CustomerRepository } from 'src/domain/customer/customer.repository';
import { generateIntegritySignature } from 'src/shared/utils/wompi.utils';
import { DeliveryRepository } from 'src/domain/delivery/delivery.repository';
import { err, Result } from 'src/shared/result';
import {
  CustomerNotFoundError,
  DeliveryNotFoundError,
  ProductNotFoundError,
} from 'src/shared/errors';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly productRepo: ProductRepository,
    private readonly wompi: WompiAdapter,
    private readonly customerRepo: CustomerRepository,
    private readonly deliveryRepo: DeliveryRepository,
  ) {}

  async execute(dto: PaymentDto) {
    const { transactionId, paymentData } = dto;

    const transaction = await this.transactionRepo.findById(transactionId);
    if (!transaction) {
      return err(new ProductNotFoundError());
    }

    const customer = await this.customerRepo.findById(transaction.customerId);
    if (!customer) {
      return err(new CustomerNotFoundError());
    }

    if (transaction.status === 'APPROVED') {
      return transaction;
    }

    const acceptanceToken = await this.wompi.getAcceptanceToken();

    const cardToken = await this.wompi.createCardToken({
      cardNumber: paymentData.cardNumber,
      cvc: paymentData.cvc,
      expMonth: paymentData.expMonth,
      expYear: paymentData.expYear,
      cardHolder: paymentData.cardHolder,
    });
    if (!cardToken.ok) {
      await this.transactionRepo.updateStatus(transactionId, 'FAILED');
      return cardToken;
    }

    const amount_in_cents = Math.round(transaction.totalAmount * 100);

    const signature = generateIntegritySignature(
      transaction.id,
      amount_in_cents,
      'COP',
    );

    const delivery = await this.deliveryRepo.findByTransactionId(transactionId);
    if (!delivery) {
      return err(new DeliveryNotFoundError());
    }

    const wompiPayload = {
      amount_in_cents: amount_in_cents,
      currency: 'COP',
      reference: transaction.id,
      acceptance_token: acceptanceToken,
      customer_email: customer.email,
      signature: signature,
      payment_method: {
        type: 'CARD',
        token: cardToken.value,
        installments: transaction.quantity,
      },
      customer_data: {
        full_name: customer.fullName,
        phone_number: customer.phone,
      },
      shipping_address: {
        address_line_1: delivery.address,
        city: delivery.city,
        region: delivery.city,
        country: delivery.country,
        postal_code: '000000',
        name: customer.fullName,
        phone_number: customer.phone,
      },
    };

    const wompiResult = await this.wompi.createPayment(wompiPayload);

    if (!wompiResult.ok) {
      await this.transactionRepo.updateStatus(transactionId, 'FAILED');
      return wompiResult;
    }

    let status: 'APPROVED' | 'FAILED' | 'PENDING' = 'PENDING';
    const maxAttempts = 5;
    const delayMs = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const result: Result<string> = await this.wompi.getTransactionStatus(
        transaction.id,
      );

      if (result.ok && result.value !== 'PENDING') {
        status = result.value === 'APPROVED' ? 'APPROVED' : 'FAILED';
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    await this.transactionRepo.updateStatus(
      transactionId,
      status,
      wompiResult.value.id,
    );

    if (status === 'APPROVED') {
      await this.productRepo.decreaseStock(
        transaction.productId,
        transaction.quantity,
      );
    }

    const response = {
      transactionId: transaction.id,
      status: status,
      wompiTransactionId: wompiResult.value.id,
    };

    return response;
  }
}
