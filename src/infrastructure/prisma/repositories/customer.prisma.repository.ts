import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CustomerRepository } from '../../../domain/customer/customer.repository';
import { Customer } from 'src/domain/customer/customer.entity';
import { CustomerMapper } from 'src/application/mappers/customer.mapper';

@Injectable()
export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const record = await this.prisma.customers.findUnique({
      where: { email },
    });

    if (!record) return null;

    return CustomerMapper.toDomain(record);
  }

  async findById(id: string): Promise<Customer | null> {
    const record = await this.prisma.customers.findUnique({
      where: { id },
    });

    if (!record) return null;

    return CustomerMapper.toDomain(record);
  }

  async create(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) {
    const record = await this.prisma.customers.create({
      data: CustomerMapper.toPersistence(customer),
    });
    return CustomerMapper.toDomain(record);
  }
}
