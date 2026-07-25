import type { Loi } from '@/mock/marketplace';

export interface FundingRoomState {
  loi: Loi | null;
  /** Stip id whose audit trail is expanded, if any. */
  expandedStipId: string | null;
  loading: boolean;
}
