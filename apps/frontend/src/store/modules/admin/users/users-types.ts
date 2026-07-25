import type { UserListItem } from '@/core/admin/user-types';

export interface UsersState {
  /** User whose access policies are being managed, if the dialog is open. */
  policiesUser: UserListItem | null;
  /** User whose privileges are being edited, if that dialog is open. */
  privilegesUser: UserListItem | null;
  /**
   * Bumped after a mutation to force the grid to refetch. The grid is keyed on
   * this, so incrementing remounts it.
   */
  refreshKey: number;
}
