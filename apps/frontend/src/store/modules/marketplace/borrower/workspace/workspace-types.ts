import type { AccountId, RequestStage } from '@/mock/marketplace';

/**
 * Layout-level state shared by every marketplace page.
 *
 * This is the one marketplace slice that is NOT owned by a single page: the
 * active account scopes what every other page reads (BUSINESS-LOGIC §2), and
 * the request stage decides whether the offers route shows the gathering hero,
 * the ranked list, or redirects into the funding room.
 */
export interface WorkspaceState {
  activeAccountId: AccountId;
  /** Lifecycle of the active account's current request. */
  stage: RequestStage;
  accountSwitcherOpen: boolean;
  newRequestOpen: boolean;
}
