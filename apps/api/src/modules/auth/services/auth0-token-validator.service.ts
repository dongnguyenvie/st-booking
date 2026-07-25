import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';

export interface Auth0TokenPayload {
  sub: string;
  email?: string;
  name?: string;
}

/**
 * Validates Auth0 access tokens using the tenant's JWKS endpoint (RS256).
 * Fetches the signing key from Auth0 and verifies the token signature.
 */
@Injectable()
export class Auth0TokenValidatorService {
  private readonly logger = new Logger(Auth0TokenValidatorService.name);
  private readonly client: jwksClient.JwksClient;
  private readonly audience: string;
  private readonly issuer: string;

  constructor(private readonly config: ConfigService) {
    const domain = this.config.get<string>('auth0.domain')!;
    this.audience = this.config.get<string>('auth0.audience')!;
    this.issuer = `https://${domain}/`;
    this.client = jwksClient({
      jwksUri: `https://${domain}/.well-known/jwks.json`,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
    });
  }

  async validate(token: string): Promise<Auth0TokenPayload> {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token format');
    }

    const signingKey = await this.getSigningKey(decoded.header.kid);

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, signingKey, {
        audience: this.audience,
        issuer: this.issuer,
        algorithms: ['RS256'],
      }) as jwt.JwtPayload;
    } catch (err) {
      this.logger.warn(`Auth0 token verification failed: ${err.message}`);
      throw new UnauthorizedException('Token verification failed');
    }

    if (!payload.sub) throw new UnauthorizedException('Token missing sub claim');

    // Access tokens often lack email/name — fetch from /userinfo
    let email = payload.email as string | undefined;
    let name = payload.name as string | undefined;

    if (!email) {
      const userInfo = await this.fetchUserInfo(token);
      email = userInfo.email;
      name = name ?? userInfo.name;
    }

    return { sub: payload.sub, email, name };
  }

  /** Fetch user profile from Auth0 /userinfo using the access token */
  private async fetchUserInfo(token: string): Promise<{ email?: string; name?: string }> {
    try {
      const res = await fetch(`${this.issuer}userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return {};
      return (await res.json()) as { email?: string; name?: string };
    } catch (err) {
      this.logger.warn(`Failed to fetch Auth0 userinfo: ${err.message}`);
      return {};
    }
  }

  private getSigningKey(kid: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.getSigningKey(kid, (err, key) => {
        if (err) {
          this.logger.error(`Failed to get Auth0 signing key: ${err.message}`);
          return reject(new UnauthorizedException('Failed to retrieve signing key'));
        }
        resolve(key!.getPublicKey());
      });
    });
  }
}
