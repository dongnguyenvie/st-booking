import { Injectable, Logger, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Auth0ManagementToken {
  access_token: string;
  expires_at: number; // epoch ms
}

interface Auth0CreateUserPayload {
  email: string;
  password: string;
  name?: string;
  connection?: string;
}

interface Auth0UserResult {
  user_id: string;
  email: string;
  name?: string;
}

/**
 * Thin wrapper around Auth0 Management API v2.
 * Uses client credentials to obtain a management token (cached until expiry).
 * Scope required: create:users
 */
@Injectable()
export class Auth0ManagementService {
  private readonly logger = new Logger(Auth0ManagementService.name);
  private readonly domain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private managementToken: Auth0ManagementToken | null = null;

  constructor(private readonly config: ConfigService) {
    this.domain = this.config.get<string>('auth0.domain')!;
    this.clientId = this.config.get<string>('auth0.management.clientId')!;
    this.clientSecret = this.config.get<string>('auth0.management.clientSecret')!;
  }

  /** Create a user in Auth0 using the Management API. Returns the Auth0 user_id. */
  async createUser(payload: Auth0CreateUserPayload): Promise<Auth0UserResult> {
    const token = await this.getManagementToken();

    const body = {
      connection: payload.connection ?? 'Username-Password-Authentication',
      email: payload.email,
      password: payload.password,
      name: payload.name,
    };

    const res = await fetch(`https://${this.domain}/api/v2/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (res.status === 409) {
      throw new ConflictException('Email already registered in Auth0');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      this.logger.error(`Auth0 create user failed: ${res.status} ${JSON.stringify(err)}`);
      throw new InternalServerErrorException('Failed to create user in Auth0');
    }

    return res.json() as Promise<Auth0UserResult>;
  }

  /** Find an Auth0 user by email — returns user_id or null if not found */
  async findUserByEmail(email: string): Promise<string | null> {
    const token = await this.getManagementToken();
    const q = encodeURIComponent(`email:"${email}"`);

    const res = await fetch(`https://${this.domain}/api/v2/users?q=${q}&search_engine=v3`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      this.logger.warn(`Auth0 search by email failed: ${res.status}`);
      return null;
    }

    const users = (await res.json()) as Array<{ user_id: string }>;
    return users.length > 0 ? users[0]!.user_id : null;
  }

  /** Delete a user from Auth0 by user_id (used for rollback on DB failure). */
  async deleteUser(auth0UserId: string): Promise<void> {
    const token = await this.getManagementToken();

    const res = await fetch(`https://${this.domain}/api/v2/users/${encodeURIComponent(auth0UserId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok && res.status !== 404) {
      this.logger.warn(`Auth0 delete user rollback failed for ${auth0UserId}: ${res.status}`);
    }
  }

  /** Reset an Auth0 user's password by user_id. Used during seeding to sync passwords. */
  async resetPassword(auth0UserId: string, newPassword: string): Promise<void> {
    const token = await this.getManagementToken();

    const res = await fetch(`https://${this.domain}/api/v2/users/${encodeURIComponent(auth0UserId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: newPassword,
        connection: 'Username-Password-Authentication',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      this.logger.warn(
        `Auth0 reset password failed for ${auth0UserId}: ${res.status} ${JSON.stringify(err)}`,
      );
    }
  }

  /** Fetch and cache a Management API token using client credentials. */
  private async getManagementToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid (with 60s buffer)
    if (this.managementToken && this.managementToken.expires_at > now + 60_000) {
      return this.managementToken.access_token;
    }

    const res = await fetch(`https://${this.domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: `https://${this.domain}/api/v2/`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      this.logger.error(`Auth0 management token fetch failed: ${JSON.stringify(err)}`);
      throw new InternalServerErrorException('Failed to obtain Auth0 management token');
    }

    const data = (await res.json()) as {
      access_token: string;
      expires_in: number;
    };
    this.managementToken = {
      access_token: data.access_token,
      expires_at: now + data.expires_in * 1000,
    };

    return this.managementToken.access_token;
  }
}
