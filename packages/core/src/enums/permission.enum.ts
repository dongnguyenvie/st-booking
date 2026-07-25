/**
 * Every grantable permission, in the glossary's `resource:verb` form.
 *
 * This enum is the single source of truth for permission keys — handlers check
 * a member (`@PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })`), the
 * seed writes them into the `permissions` table, and roles grant a subset (see
 * ROLE_PERMISSIONS). Never write the raw string: the enum is what makes a typo
 * a compile error instead of a silently unenforced route.
 *
 * The *value* is persisted (permissions.key) — renaming a member is safe,
 * changing its string value is a migration.
 */
export enum PermissionKey {
  // Borrower — request lifecycle
  REQUEST_CREATE = 'request:create',
  REQUEST_READ = 'request:read',
  REQUEST_CANCEL = 'request:cancel',
  OFFER_READ = 'offer:read',
  LOI_SIGN = 'loi:sign',
  LOI_CANCEL = 'loi:cancel',

  // Lender desk — pricing & funding
  REQUEST_UNLOCK = 'request:unlock',
  OFFER_POST = 'offer:post',
  OFFER_REVISE = 'offer:revise',
  STIP_REQUEST = 'stip:request',
  STIP_REVIEW = 'stip:review',
  STIP_APPROVE = 'stip:approve',
  FUNDING_CONFIRM = 'funding:confirm',

  // Lender owner — org management
  MEMBER_MANAGE = 'member:manage',
  BILLING_READ = 'billing:read',
  BILLING_MANAGE = 'billing:manage',

  // Admin — internal ops
  USER_READ = 'user:read',
  USER_MANAGE = 'user:manage',
  ROLE_READ = 'role:read',
  ROLE_MANAGE = 'role:manage',
  PERMISSION_READ = 'permission:read',
  LENDER_ONBOARD = 'lender:onboard',
  WORKSPACE_VERIFY = 'workspace:verify',
}
