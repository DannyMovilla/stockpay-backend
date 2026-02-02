import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/infrastructure/http/product.controller';
import { GetProductsUseCase } from 'src/application/use-cases/get-products.usecase';

describe('ProductController', () => {
  let controller: ProductController;

  const mockUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: GetProductsUseCase, useValue: mockUseCase }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should return list of products', async () => {
    const products = [{ id: 'prod1', name: 'Prod 1' }];
    mockUseCase.execute.mockResolvedValue(products);

    const result = await controller.getAll();
    expect(result).toEqual(products);
  });
});
