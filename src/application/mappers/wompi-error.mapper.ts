import { PaymentFailedError } from 'src/shared/errors';

export function mapWompiError(error: any): PaymentFailedError {
  const messages =
    error?.response?.data?.error?.messages ??
    error?.response?.data?.error?.message ??
    null;

  if (Array.isArray(messages)) {
    return new PaymentFailedError(messages.join(', '));
  }

  if (typeof messages === 'string') {
    return new PaymentFailedError(messages);
  }

  return new PaymentFailedError('Wompi payment error');
}
