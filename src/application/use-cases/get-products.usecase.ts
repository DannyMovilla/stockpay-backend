import { ProductRepository } from '../../domain/product/product.repository';

export class GetProductsUseCase {
  constructor(private readonly productRepo: ProductRepository) {}

  async execute() {
    return this.productRepo.findAll();
  }
}
