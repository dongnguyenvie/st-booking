import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const PRE_AUTH_TTL_SECS = 5 * 60; // 5 minutes
export const PRE_AUTH_AUDIENCE = '2fa-challenge';
const PRE_AUTH_STEP = 'pre-auth';

export interface PreAuthPayload {
  sub: string;
  step: string;
  aud: string;
  iat: number;
  exp: number;
}

/**
 * Handles issuance and verification of short-lived pre-auth JWTs.
 * Pre-auth tokens use the same RS256 keypair but a distinct audience
 * (2fa-challenge) so they cannot be used as real session tokens.
 */
@Injectable()
export class PreAuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** Issue a 5-minute pre-auth JWT for the given userId. */
  issue(userId: string): string {
    const privateKey = this.configService.get<string>('jwt.privateKey');
    return this.jwtService.sign(
      { sub: userId, step: PRE_AUTH_STEP, aud: PRE_AUTH_AUDIENCE },
      { privateKey, algorithm: 'RS256', expiresIn: PRE_AUTH_TTL_SECS },
    );
  }

  /**
   * Verify a pre-auth JWT — throws UnauthorizedException on any failure.
   * Checks: signature, expiry, audience=2fa-challenge, step=pre-auth.
   */
  verify(token: string): PreAuthPayload {
    try {
      const publicKey = this.configService.get<string>('jwt.publicKey');
      const payload = this.jwtService.verify<PreAuthPayload>(token, {
        publicKey,
        algorithms: ['RS256'],
        audience: PRE_AUTH_AUDIENCE,
      });
      if (payload.step !== PRE_AUTH_STEP) {
        throw new UnauthorizedException('Invalid token step');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired pre-auth token');
    }
  }
}
