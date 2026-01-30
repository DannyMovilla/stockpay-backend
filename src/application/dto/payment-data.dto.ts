import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '4242424242424242',
    description: 'Número de tarjeta de crédito',
  })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12', description: 'Mes de expiración (2 dígitos)' })
  expMonth: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '29', description: 'Año de expiración (2 dígitos)' })
  expYear: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'Código de seguridad (CVC)' })
  cvc: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'John Doe',
    description: 'Nombre del titular de la tarjeta',
  })
  cardHolder: string;
}
