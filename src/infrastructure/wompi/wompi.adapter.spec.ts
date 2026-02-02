import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { WompiAdapter } from './wompi.adapter';
import axios from 'axios';
import { generateIntegritySignature } from 'src/shared/utils/wompi.utils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;

  beforeEach(() => {
    adapter = new WompiAdapter();
  });

  it('should create a card token', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: 'tok_test_123' } },
    });

    const token = await adapter.createCardToken({
      cardNumber: '4242424242424242',
      cvc: '123',
      expMonth: '12',
      expYear: '29',
      cardHolder: 'Juan Perez',
    });

    expect(token).toBe('tok_test_123');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/tokens/cards',
      expect.objectContaining({ number: '4242424242424242' }),
    );
  });

  it('should generate integrity signature correctly', () => {
    const reference = 'ref123';
    const amountInCents = 150000;
    const currency = 'COP';
    process.env.WOMPI_INTEGRITY_SECRET = 'test_secret';

    const signature = generateIntegritySignature(
      reference,
      amountInCents,
      currency,
    );
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
  });

  it('should create a payment', async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: 'wompi_tx_1' } },
    });

    const payment = await adapter.createPayment({
      amount_in_cents: 150000,
      currency: 'COP',
      reference: 'ref123',
      customer_email: 'test@test.com',
      payment_method: { type: 'CARD', token: 'tok_test', installments: 1 },
      acceptance_token: 'accept123',
      signature: 'sig123',
    });

    expect(payment.id).toBe('wompi_tx_1');
  });
});
