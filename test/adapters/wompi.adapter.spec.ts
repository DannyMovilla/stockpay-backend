import { WompiAdapter } from '../../src/infrastructure/wompi/wompi.adapter';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiAdapter', () => {
  let adapter: WompiAdapter;

  beforeEach(() => {
    adapter = new WompiAdapter();
    jest.clearAllMocks();
  });

  it('should create card token', async () => {
    const mockToken = 'tok_test_123';
    mockedAxios.post.mockResolvedValueOnce({
      data: { data: { id: mockToken } },
    });

    const token = await adapter.createCardToken({
      cardNumber: '4242424242424242',
      expMonth: '12',
      expYear: '29',
      cvc: '123',
      cardHolder: 'Test User',
    });

    expect(token).toBe(mockToken);
    expect(mockedAxios.post).toHaveBeenCalledWith('/tokens/cards', {
      number: '4242424242424242',
      exp_month: '12',
      exp_year: '29',
      cvc: '123',
      card_holder: 'Test User',
    });
  });

  it('should create payment', async () => {
    const mockPayment = { id: 'pay_123', status: 'APPROVED' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockPayment });

    const payment = await adapter.createPayment({
      amount_in_cents: 150000,
      currency: 'COP',
      reference: 'ref_123',
      customer_email: 'test@example.com',
      payment_method: { type: 'CARD', token: 'tok_test_123', installments: 1 },
      acceptance_token: 'accept_token_123',
      signature: 'sig_123',
    });

    expect(payment.id).toBe('pay_123');
    expect(payment.status).toBe('APPROVED');
    expect(mockedAxios.post).toHaveBeenCalledWith('/transactions', {
      amount_in_cents: 150000,
      currency: 'COP',
      reference: 'ref_123',
      customer_email: 'test@example.com',
      payment_method: { type: 'CARD', token: 'tok_test_123', installments: 1 },
      acceptance_token: 'accept_token_123',
      signature: 'sig_123',
    });
  });
});
