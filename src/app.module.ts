import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductController } from './infrastructure/http/product.controller';
import { TransactionController } from './infrastructure/http/transaction.controller';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { WompiAdapter } from './infrastructure/wompi/wompi.adapter';
import { ProductPrismaRepository } from './infrastructure/prisma/repositories/product.prisma.repository';
import { TransactionPrismaRepository } from './infrastructure/prisma/repositories/transaction.prisma.repository';
import { GetProductsUseCase } from './application/use-cases/get-products.usecase';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.usecase';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.usecase';
import { ProductRepository } from './domain/product/product.repository';
import { CustomerRepository } from './domain/customer/customer.repository';
import { TransactionRepository } from './domain/transaction/transaction.repository';
import { DeliveryRepository } from './domain/delivery/delivery.repository';
import {
  CUSTOMER_REPOSITORY,
  DELIVERY_REPOSITORY,
  PRODUCT_REPOSITORY,
  TRANSACTION_REPOSITORY,
} from './domain/tokens';
import { CustomerPrismaRepository } from './infrastructure/prisma/repositories/customer.prisma.repository';
import { DeliveryPrismaRepository } from './infrastructure/prisma/repositories/delivery.prisma.repository';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.usecase';

@Module({
  imports: [],
  controllers: [AppController, ProductController, TransactionController],
  providers: [
    AppService,
    PrismaService,
    WompiAdapter,

    // Repositories
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductPrismaRepository,
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerPrismaRepository,
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionPrismaRepository,
    },
    {
      provide: DELIVERY_REPOSITORY,
      useClass: DeliveryPrismaRepository,
    },

    // Use Cases
    {
      provide: GetProductsUseCase,
      useFactory: (repo) => new GetProductsUseCase(repo),
      inject: ['ProductRepository'],
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (
        productRepo: ProductRepository,
        customerRepo: CustomerRepository,
        transactionRepo: TransactionRepository,
        deliveryRepo: DeliveryRepository,
      ) =>
        new CreateTransactionUseCase(
          productRepo,
          customerRepo,
          transactionRepo,
          deliveryRepo,
        ),
      inject: [
        'ProductRepository',
        'CustomerRepository',
        'TransactionRepository',
        'DeliveryRepository',
      ],
    },
    {
      provide: ProcessPaymentUseCase,
      useFactory: (txRepo, productRepo, customerRepo, wompi, deliveryRepo) =>
        new ProcessPaymentUseCase(
          txRepo,
          productRepo,
          wompi,
          customerRepo,
          deliveryRepo,
        ),
      inject: [
        'TransactionRepository',
        'ProductRepository',
        'CustomerRepository',
        WompiAdapter,
        'DeliveryRepository',
      ],
    },
    {
      provide: GetTransactionUseCase,
      useFactory: (
        transactionRepo: TransactionRepository,
        productRepo: ProductRepository,
        deliveryRepo: DeliveryRepository,
      ) =>
        new GetTransactionUseCase(transactionRepo, productRepo, deliveryRepo),
      inject: [
        'TransactionRepository',
        'ProductRepository',
        'DeliveryRepository',
      ],
    },
  ],
})
export class AppModule {}
