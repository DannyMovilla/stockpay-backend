import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductRepository } from '../../../domain/product/product.repository';
import { Product } from 'src/domain/product/product.entity';
import { ProductMapper } from 'src/application/mappers/product.mapper';

@Injectable()
export class ProductPrismaRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.products.findMany({
      where: { active: true },
    });

    return ProductMapper.toDomainList(records);
  }

  async findById(id: string): Promise<Product | null> {
    const record = await this.prisma.products.findUnique({
      where: { id, active: true },
    });

    return record ? ProductMapper.toDomain(record) : null;
  }

  async decreaseStock(productId: string, quantity: number) {
    await this.prisma.products.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });
  }
}
