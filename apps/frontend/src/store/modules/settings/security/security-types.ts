import type { DisableStep, SetupStep } from '@/core/settings/two-factor-types';

export interface SecurityState {
  setupStep: SetupStep;
  disableStep: DisableStep;
  /** Data URL of the TOTP QR code, present only during show-qr. */
  qrDataUrl: string | null;
  /** The TOTP secret, shown alongside the QR for manual entry. */
  secret: string | null;
  setupError: string | null;
  disableError: string | null;
}
