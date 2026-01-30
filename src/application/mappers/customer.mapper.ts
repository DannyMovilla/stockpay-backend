import { Customer } from 'src/domain/customer/customer.entity';

export class CustomerMapper {
  static toDomain(record: any): Customer {
    return new Customer(
      record.id,
      record.full_name,
      record.email,
      record.phone,
      record.created_at,
    );
  }

  static toPersistence(customer: Omit<Customer, 'id' | 'createdAt'>) {
    return {
      full_name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    };
  }
}
