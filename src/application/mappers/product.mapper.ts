import { Product } from 'src/domain/product/product.entity';

export class ProductMapper {
  static toDomain(record: any): Product {
    return new Product(
      record.id,
      record.name,
      record.description,
      record.price,
      record.stock,
      record.image_url,
      record.active,
      record.created_at,
      record.updated_at,
    );
  }

  static toDomainList(records: any[]): Product[] {
    return records.map(this.toDomain);
  }
}
