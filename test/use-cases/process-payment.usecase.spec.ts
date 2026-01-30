import { ProcessPaymentUseCase } from '../../src/application/use-cases/process-payment.usecase';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let transactionRepo: any;
  let customerRepo: any;
  let productRepo: any;
  let wompi: any;

  beforeEach(() => {
    transactionRepo = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
      decreaseStock: jest.fn(),
    };

    customerRepo = {
      findById: jest.fn(),
    };

    productRepo = {
      findById: jest.fn(),
    };

    wompi = {
      createCardToken: jest.fn(),
      createPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };

    useCase = new ProcessPaymentUseCase(
      transactionRepo,
      wompi,
      customerRepo,
      productRepo,
    );
  });

  it('should process payment successfully', async () => {
    const transaction = {
      id: 'tx_123',
      totalAmount: 1500,
      productId: 'prod_123',
      quantity: 2,
    };

    transactionRepo.findById.mockResolvedValue(transaction);
    wompi.createCardToken.mockResolvedValue('tok_123');
    wompi.createPayment.mockResolvedValue({ id: 'pay_123', status: 'PENDING' });
    wompi.getTransactionStatus.mockResolvedValue({
      status: 'APPROVED',
      transaction_id: 'pay_123',
    });

    const result = await useCase.execute({
      transactionId: 'tx_123',
      paymentData: {
        cardNumber: '4242424242424242',
        expMonth: '12',
        expYear: '29',
        cvc: '123',
        cardHolder: 'Test User',
      },
    });

    expect(transactionRepo.updateStatus).toHaveBeenCalledWith(
      'tx_123',
      'APPROVED',
      'pay_123',
    );
    expect(transactionRepo.decreaseStock).toHaveBeenCalledWith('prod_123', 2);
    expect(result.id).toBe('pay_123');
  });

  it('should throw error if transaction not found', async () => {
    transactionRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        transactionId: 'tx_missing',
        paymentData: {
          cardNumber: '4242424242424242',
          expMonth: '12',
          expYear: '29',
          cvc: '123',
          cardHolder: 'Test User',
        },
      }),
    ).rejects.toThrow('Transaction not found');
  });
});
