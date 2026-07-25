import { IEmailService } from '../../src/modules/@core/email/email.service.interface';

/**
 * Test email service that captures OTP codes in-memory instead of sending.
 * Stores the last sent code per email address.
 */
export class TestEmailService implements IEmailService {
  private store = new Map<string, string>();

  async sendOtp(to: string, code: string, expiresInMinutes: number): Promise<void> {
    this.store.set(to, code);
  }

  getLastCode(to: string): string | undefined {
    return this.store.get(to);
  }

  resetAll(): void {
    this.store.clear();
  }
}
