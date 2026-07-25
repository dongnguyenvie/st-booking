/** Injection token for IEmailService — use this in @Inject() decorators. */
export const EMAIL_SERVICE = 'EMAIL_SERVICE';

/**
 * Minimal email service contract for OTP delivery.
 * Production implementations (SendGrid, SES, etc.) must fulfill this interface.
 */
export interface IEmailService {
  /**
   * Sends a one-time passcode to the given email address.
   * @param to - Recipient email
   * @param code - 6-digit OTP string
   * @param expiresInMinutes - How long until the code expires (used in email body)
   */
  sendOtp(to: string, code: string, expiresInMinutes: number): Promise<void>;
}
