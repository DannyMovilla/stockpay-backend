import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from 'src/infrastructure/http/transaction.controller';
import { ProcessPaymentUseCase } from 'src/application/use-cases/process-payment.usecase';
import { TransactionRepository } from 'src/domain/transaction/transaction.repository';

describe('TransactionController', () => {
  let controller: TransactionController;
  let processPaymentUseCase: ProcessPaymentUseCase;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: ProcessPaymentUseCase, useValue: mockUseCase },
        { provide: TransactionRepository, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(
      ProcessPaymentUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call process payment use-case', async () => {
    mockUseCase.execute.mockResolvedValue({ id: 'tx_test', status: 'PENDING' });

    const payload = { productId: 'prod_1', customerId: 'cust_1', amount: 1000 };
    const result = await controller.processPayment(payload);

    expect(mockUseCase.execute).toHaveBeenCalledWith(payload);
    expect(result).toEqual({ id: 'tx_test', status: 'PENDING' });
  });
});
