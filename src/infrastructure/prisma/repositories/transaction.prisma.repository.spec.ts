import { describe, it, expect, beforeEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { TransactionPrismaRepository } from 'src/infrastructure/prisma/repositories/transaction.prisma.repository';

const prisma = new PrismaClient();

describe('TransactionPrismaRepository', () => {
  let repo: TransactionPrismaRepository;

  beforeEach(() => {
    repo = new TransactionPrismaRepository(prisma as any);
  });

  it('should create a transaction', async () => {
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
    const created = await repo.create({
      productId: 'prod_test2',
      customerId: 'cust_test2',
      amount: 2000,
      baseFee: 100,
      shippingFee: 200,
      totalAmount: 2300,
      quantity: 2,
      status: 'PENDING',
    });

    const found = await repo.findById(created.id);
    expect(found?.id).toBe(created.id);
    expect(found?.quantity).toBe(2);
  });

  it('should decrease stock', async () => {
    await prisma.products.create({
      data: { id: 'prod_stock', name: 'Test Product', stock: 10 },
    });

    await repo.decreaseStock('prod_stock', 3);
    const product = await prisma.products.findUnique({
      where: { id: 'prod_stock' },
    });
    expect(product?.stock).toBe(7);
  });
});
