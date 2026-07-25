import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

const ISSUER = 'Canmore Stays';

@Injectable()
export class TotpHelper {
  /** Generate a new base32 TOTP secret. */
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  /** Build an otpauth:// URI for use in QR codes. */
  buildOtpauthUrl(secret: string, email: string): string {
    return authenticator.keyuri(email, ISSUER, secret);
  }

  /** Render an otpauth URI as a base64 data URL (PNG). */
  async qrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  /** Verify a 6-digit TOTP token against a base32 secret. */
  verifyToken(secret: string, token: string): boolean {
    return authenticator.verify({ token, secret });
  }
}
