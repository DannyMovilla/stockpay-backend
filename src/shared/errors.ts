export class ProductNotFoundError extends Error {
  constructor() {
    super('Product not found');
  }
}

export class PaymentFailedError extends Error {
  constructor(message = 'Payment failed') {
    super(message);
  }
}

export class TransactionStatusError extends Error {
  constructor(message = 'Transaction status error') {
    super(message);
  }
}
