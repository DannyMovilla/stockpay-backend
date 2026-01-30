import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionRepository } from '../../../domain/transaction/transaction.repository';
import { Transaction } from 'src/domain/transaction/transaction.entity';
import { TransactionMapper } from 'src/application/mappers/transaction.mapper';

@Injectable()
export class TransactionPrismaRepository implements TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    transaction: Omit<Transaction, 'id' | 'createdAt'>,
  ): Promise<Transaction> {
    const record = await this.prisma.transactions.create({
      data: {
        status: transaction.status,
        amount: transaction.amount,
        base_fee: transaction.baseFee,
        shipping_fee: transaction.shippingFee,
        total_amount: transaction.totalAmount,
        quantity: transaction.quantity,
        product_id: transaction.productId,
        customer_id: transaction.customerId,
      },
    });

    return TransactionMapper.toDomain(record);
  }

  async findById(id: string): Promise<Transaction | null> {
    const record = await this.prisma.transactions.findUnique({
      where: { id },
    });

    return record ? TransactionMapper.toDomain(record) : null;
  }

  async updateStatus(
    id: string,
    status: string,
    wompiTransactionId?: string,
  ): Promise<void> {
    await this.prisma.transactions.update({
      where: { id },
      data: TransactionMapper.toPersistence({
        status: status as any,
        wompiTransactionId,
      }),
    });
  }
}
