import { Injectable } from '@nestjs/common';
import axios from 'axios';

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

  async createPayment(data) {
    try {
      const response = await this.privateApi.post('/transactions', data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getTransactionStatus(
    reference: string,
  ): Promise<'APPROVED' | 'PENDING' | 'FAILED' | null> {
    try {
      const response = await this.privateApi.get(
        `/transactions?reference=${reference}`,
      );

      const transaction = response.data?.data?.[0]; // la API devuelve un array
      if (!transaction) return null;

      // Mapear estados de Wompi a tus estados internos
      switch (transaction.status) {
        case 'APPROVED':
          return 'APPROVED';
        case 'DECLINED':
        case 'VOIDED':
        case 'FAILED':
          return 'FAILED';
        case 'PENDING':
        default:
          return 'PENDING';
      }
    } catch (error: any) {
      return null;
    }
  }

  async getAcceptanceToken(): Promise<string> {
    const response = await axios.get(
      `${process.env.WOMPI_API_URL}/merchants/${process.env.WOMPI_PUBLIC_KEY}`,
    );

    return response.data.data.presigned_acceptance.acceptance_token;
  }

  async createCardToken(card) {
    try {
      const response = await this.publicApi.post('/tokens/cards', {
        number: card.cardNumber,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
        card_holder: card.cardHolder,
      });

      return response.data.data.id;
    } catch (error) {
      throw error;
    }
  }
}
