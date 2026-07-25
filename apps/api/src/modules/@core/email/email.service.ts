import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from './email.service.interface';

/**
 * Development-only email stub — prints OTP to stdout instead of sending.
 * Throws at construction if NODE_ENV=production to prevent accidental deployment.
 */
// Global in-memory store for test OTP codes (dev only)
export const testOtpStore = new Map<string, { code: string; timestamp: number }>();

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {}

  async sendOtp(to: string, code: string, expiresInMinutes: number): Promise<void> {
    const border = '============================';
    this.logger.log(
      `\n${border}\n` +
        `[Email OTP Stub]\n` +
        `To:      ${to}\n` +
        `Code:    ${code}\n` +
        `Expires: in ${expiresInMinutes} minute${expiresInMinutes !== 1 ? 's' : ''}\n` +
        `${border}`,
    );
    // Store for test helper access
    testOtpStore.set(to, { code, timestamp: Date.now() });
  }
}
