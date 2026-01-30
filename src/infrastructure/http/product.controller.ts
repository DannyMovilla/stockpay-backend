import { Controller, Get } from '@nestjs/common';
import { GetProductsUseCase } from '../../application/use-cases/get-products.usecase';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  async getAll() {
    return this.getProductsUseCase.execute();
  }
}
