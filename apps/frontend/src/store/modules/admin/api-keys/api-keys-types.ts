export interface ApiKeysState {
  createDialogOpen: boolean;
  /** Surfaced from a failed delete; cleared on the next attempt. */
  deleteError: string | null;
}
