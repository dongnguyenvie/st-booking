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
  // Guest — reservation lifecycle
  RESERVATION_CREATE = 'reservation:create',
  RESERVATION_READ = 'reservation:read',
  RESERVATION_CANCEL = 'reservation:cancel',
  REVIEW_CREATE = 'review:create',
  REVIEW_READ = 'review:read',

  // Host desk — inventory & stay operations
  LISTING_READ = 'listing:read',
  LISTING_CREATE = 'listing:create',
  LISTING_UPDATE = 'listing:update',
  LISTING_PUBLISH = 'listing:publish',
  AVAILABILITY_MANAGE = 'availability:manage',
  PRICING_MANAGE = 'pricing:manage',
  RESERVATION_CONFIRM = 'reservation:confirm',
  REVIEW_RESPOND = 'review:respond',

  // Host owner — org management
  MEMBER_MANAGE = 'member:manage',
  BILLING_READ = 'billing:read',
  BILLING_MANAGE = 'billing:manage',

  // Admin — internal ops
  USER_READ = 'user:read',
  USER_MANAGE = 'user:manage',
  ROLE_READ = 'role:read',
  ROLE_MANAGE = 'role:manage',
  PERMISSION_READ = 'permission:read',
  HOST_ONBOARD = 'host:onboard',
  LISTING_VERIFY = 'listing:verify',
  CONTENT_MANAGE = 'content:manage',
}
