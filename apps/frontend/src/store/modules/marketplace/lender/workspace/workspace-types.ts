/**
 * Layout-level state for the lender desk.
 *
 * The desk shell needs a triage count on every screen, not just on the deals
 * page. Reading it from the deals slice would couple the layout to one page's
 * lifecycle — navigate to deal detail, that page resets, and the sidebar badge
 * would blank out. This slice owns it independently, mirroring the borrower
 * side's workspace slice.
 */
export interface LenderWorkspaceState {
  /** Deals where the borrower moved last and the desk has not answered. */
  needsReplyCount: number;
  /** Total live requests visible to this desk. */
  queueCount: number;
}
