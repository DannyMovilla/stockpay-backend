import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PaymentDataDto } from 'src/application/dto/payment-data.dto';
import { mapWompiError } from 'src/application/mappers/wompi-error.mapper';
import { err, ok, Result } from 'src/shared/result';

@Injectable()
export class WompiAdapter {
  private publicApi = axios.create({
    baseURL: process.env.WOMPI_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
    },
  });

  private privateApi = axios.create({
    baseURL: process.env.WOMPI_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.WOMPI_PRIVATE_KEY}`,
    },
  });

  async createPayment(data): Promise<any> {
    try {
      const response = await this.privateApi.post('/transactions', data);
      return ok(response.data.data);
    } catch (error) {
      return err(mapWompiError(error));
    }
  }

  async getTransactionStatus(
    reference: string,
  ): Promise<Result<'APPROVED' | 'PENDING' | 'FAILED'>> {
    try {
      const response = await this.privateApi.get(
        `/transactions?reference=${reference}`,
      );

      const transaction = response.data?.data?.[0];
      if (!transaction) return null;

      switch (transaction.status) {
        case 'APPROVED':
          return ok('APPROVED');
        case 'DECLINED':
        case 'VOIDED':
        case 'FAILED':
          return ok('FAILED');
        case 'PENDING':
        default:
          return ok('PENDING');
      }
    } catch (error: any) {
      return err(mapWompiError(error));
    }
  }

  async getAcceptanceToken(): Promise<string> {
    const response = await axios.get(
      `${process.env.WOMPI_API_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`,
    );

    return response.data.data.presigned_acceptance.acceptance_token;
  }

  async createCardToken(card: PaymentDataDto) {
    try {
      const response = await this.publicApi.post('/tokens/cards', {
        number: card.cardNumber,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
        card_holder: card.cardHolder,
      });

      return ok(response.data.data.id);
    } catch (error) {
      return err(mapWompiError(error));
    }
  }
}
