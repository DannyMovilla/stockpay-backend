import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ProcessPaymentUseCase } from './process-payment.usecase';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let transactionRepo: any;
  let wompi: any;

  beforeEach(() => {
    transactionRepo = {
      findById: jest.fn(),
      updateStatus: jest.fn(),
      decreaseStock: jest.fn(),
    };
    wompi = {
      createCardToken: jest.fn(),
      createPayment: jest.fn(),
      getTransactionStatus: jest.fn(),
    };
    useCase = new ProcessPaymentUseCase(
      transactionRepo,
      wompi,
      {} as any,
      {} as any,
    );
  });

  it('should execute payment flow and update status', async () => {
    const transaction = {
      id: 'tx1',
      totalAmount: 1500,
      productId: 'prod1',
      quantity: 2,
    };
    transactionRepo.findById.mockResolvedValue(transaction);
    wompi.createCardToken.mockResolvedValue('tok_test_123');
    wompi.createPayment.mockResolvedValue({ id: 'wompi_tx_1' });
    wompi.getTransactionStatus.mockResolvedValue({
      status: 'APPROVED',
      transaction_id: 'wompi_tx_1',
    });

    await useCase.execute({
      transactionId: 'tx1',
      paymentData: {
        cardNumber: '4242424242424242',
        cvc: '123',
        expMonth: '12',
        expYear: '29',
        cardHolder: 'Juan',
      },
    });

    expect(transactionRepo.decreaseStock).toHaveBeenCalledWith('prod1', 2);
    expect(transactionRepo.updateStatus).toHaveBeenCalledWith(
      'tx1',
      'APPROVED',
      'wompi_tx_1',
    );
  });

  it('should throw error if transaction not found', async () => {
    transactionRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        transactionId: 'tx1',
        paymentData: {
          cardNumber: '4242424242424242',
          cvc: '123',
          expMonth: '12',
          expYear: '29',
          cardHolder: 'Juan',
        },
      }),
    ).rejects.toThrow('Transaction not found');
  });
});
