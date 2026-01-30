import * as crypto from 'crypto';

export function generateIntegritySignature(
  transactionRef: string,
  amountInCents: number,
  currency: string,
  withSha = true,
) {
  const cadenaConcatenada = `${transactionRef}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
  if (!withSha) {
    return cadenaConcatenada;
  }
  const hashBuffer = crypto
    .createHash('sha256')
    .update(cadenaConcatenada)
    .digest('hex');
  return hashBuffer;
}
