import type { TwoFactorMethod } from '@/api-service/generated/graphql.generated';

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  /** Numeric privilege flags — only SUPER_ADMIN is meaningful now */
  privileges: number[];
  /** Role names from myAccess (drives landing route + coarse nav) */
  roles?: string[];
  /** Flattened resource:verb permission keys from myAccess (drives UI gating) */
  permissions?: string[];
  twoFactorEnabled?: boolean;
  twoFactorMethod?: TwoFactorMethod | null;
}

/** Ephemeral 2FA challenge — MUST NOT be persisted (not in redux-persist whitelist) */
export interface TwoFactorChallenge {
  preAuthToken: string;
  method: TwoFactorMethod;
  /** Email address to display "Code sent to <email>" */
  email: string;
}

export interface AuthState {
  loadingCount: number;
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  errorAfterSubmit: string | null;
  /** Currently active privilege (for users with multiple privilege groups) */
  activePrivilege: number | null;
  /** In-memory only: populated when signIn returns twoFactorRequired=true. Cleared on success/logout. */
  twoFactorChallenge: TwoFactorChallenge | null;
}
