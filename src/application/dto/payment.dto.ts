import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentDataDto } from './payment-data.dto';

export class PaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'txn_123456789',
    description: 'ID único de la transacción',
  })
  transactionId: string;

  @IsObject()
  @ApiProperty({
    type: () => PaymentDataDto,
    description: 'Datos de pago con tarjeta',
  })
  paymentData: PaymentDataDto;
}
