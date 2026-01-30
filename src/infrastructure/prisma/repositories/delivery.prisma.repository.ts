import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DeliveryRepository } from '../../../domain/delivery/delivery.repository';
import { DeliveryMapper } from 'src/application/mappers/delivery.mapper';
import { Delivery } from 'src/domain/delivery/delivery.entity';

@Injectable()
export class DeliveryPrismaRepository implements DeliveryRepository {
  constructor(private prisma: PrismaService) {}

  async create(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) {
    const record = await this.prisma.deliveries.create({
      data: DeliveryMapper.toPersistence(delivery),
    });
    return DeliveryMapper.toDomain(record);
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const record = await this.prisma.deliveries.findUnique({
      where: { transaction_id: transactionId },
    });

    return record ? DeliveryMapper.toDomain(record) : null;
  }
}
