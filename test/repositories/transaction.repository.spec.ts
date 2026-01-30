import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { TransactionRepository } from 'src/domain/transaction/transaction.repository';
import { TransactionPrismaRepository } from 'src/infrastructure/prisma/repositories/transaction.prisma.repository';

describe('TransactionRepository', () => {
  let repo: TransactionRepository;
  let mockPrisma: any;

  beforeEach(() => {
    // Mock de Prisma
    mockPrisma = {
      transactions: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      products: {
        update: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };

    repo = new TransactionPrismaRepository(mockPrisma);
  });

  it('should create a transaction', async () => {
    const transactionMock = {
      id: 'tx1',
      totalAmount: 1150,
    };
    mockPrisma.transactions.create.mockResolvedValue(transactionMock);

    const transaction = await repo.create({
      productId: 'prod_test',
      customerId: 'cust_test',
      amount: 1000,
      baseFee: 50,
      shippingFee: 100,
      totalAmount: 1150,
      quantity: 1,
      status: 'PENDING',
    });

    expect(transaction).toHaveProperty('id');
    expect(transaction.totalAmount).toBe(1150);
  });

  it('should find transaction by id', async () => {
    const transactionMock = {
      id: 'tx2',
      quantity: 2,
    };
    mockPrisma.transactions.findUnique.mockResolvedValue(transactionMock);

    const found = await repo.findById('tx2');
    expect(found?.id).toBe('tx2');
    expect(found?.quantity).toBe(2);
  });
});
