import { authenticator } from 'otplib';

export function computeTOTP(secret: string): string {
  return authenticator.generate(secret);
}
