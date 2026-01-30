import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsUUID()
  @ApiProperty()
  productId: string;

  // 👤 Cliente
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  phone: string;

  // 🚚 Delivery
  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  city: string;

  @IsString()
  @ApiProperty()
  country: string;

  // 💰 Precios
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  baseFee: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  shippingFee: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  totalAmount: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quantity: number;
}
