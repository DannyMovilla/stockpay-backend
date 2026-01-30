import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.usecase';
import { ProcessPaymentUseCase } from '../../application/use-cases/process-payment.usecase';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';
import { PaymentDto } from '../../application/dto/payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetTransactionUseCase } from 'src/application/use-cases/get-transaction.usecase';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear transacción pendiente' })
  create(@Body() dto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(dto);
  }

  @Post('pay')
  @ApiOperation({ summary: 'Procesar pago' })
  pay(@Body() dto: PaymentDto) {
    return this.processPaymentUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener transacción por ID' })
  getById(@Param('id') id: string) {
    return this.getTransactionUseCase.execute(id);
  }
}
