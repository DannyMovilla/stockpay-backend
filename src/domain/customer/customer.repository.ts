import { Customer } from './customer.entity';

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  create(
    customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Customer>;
}
