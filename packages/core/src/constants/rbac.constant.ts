import { PermissionKey } from '../enums/permission.enum';
import { RoleName } from '../enums/role-name.enum';

/**
 * The RBAC catalog — what each permission means and which roles grant it.
 * Shared by the API (schema seed + guards) and the frontend (UI gating + nav).
 *
 * Keys themselves live in PermissionKey; roles in RoleName. This file only adds
 * the human-facing descriptions and the role → permission mapping.
 */

export interface PermissionDef {
  key: PermissionKey;
  /** The `resource` half of `resource:verb` — the frontend groups by this. */
  resource: string;
  /** The `verb` half. */
  action: string;
  description: string;
}

/** Split `resource:verb` once, so resource/action can never drift from the key. */
const define = (key: PermissionKey, description: string): PermissionDef => {
  const [resource = '', action = ''] = key.split(':');
  return { key, resource, action, description };
};

/** Every permission, seeded into the `permissions` table. */
export const PERMISSIONS: PermissionDef[] = [
  // Guest — reservation lifecycle
  define(PermissionKey.RESERVATION_CREATE, 'Book a stay'),
  define(PermissionKey.RESERVATION_READ, 'View a reservation'),
  define(PermissionKey.RESERVATION_CANCEL, 'Cancel a reservation'),
  define(PermissionKey.REVIEW_CREATE, 'Leave a review after a stay'),
  define(PermissionKey.REVIEW_READ, 'View reviews'),

  // Host desk — inventory & stay operations
  define(PermissionKey.LISTING_READ, 'View a listing'),
  define(PermissionKey.LISTING_CREATE, 'Create a listing'),
  define(PermissionKey.LISTING_UPDATE, 'Edit listing details and photos'),
  define(PermissionKey.LISTING_PUBLISH, 'Publish or unpublish a listing'),
  define(PermissionKey.AVAILABILITY_MANAGE, 'Manage the availability calendar'),
  define(PermissionKey.PRICING_MANAGE, 'Manage nightly rates and pricing rules'),
  define(PermissionKey.RESERVATION_CONFIRM, 'Confirm or decline a reservation'),
  define(PermissionKey.REVIEW_RESPOND, 'Reply publicly to a guest review'),

  // Host owner — org management
  define(PermissionKey.MEMBER_MANAGE, 'Invite and manage workspace members'),
  define(PermissionKey.BILLING_READ, 'View billing / the workspace ledger'),
  define(PermissionKey.BILLING_MANAGE, 'Manage billing and payment methods'),

  // Admin — internal ops
  define(PermissionKey.USER_READ, 'View users'),
  define(PermissionKey.USER_MANAGE, 'Manage users'),
  define(PermissionKey.ROLE_READ, 'View roles and their permissions'),
  define(PermissionKey.ROLE_MANAGE, 'Create / edit roles and assignments'),
  define(PermissionKey.PERMISSION_READ, 'View the permission catalog'),
  define(PermissionKey.HOST_ONBOARD, 'Onboard a Host workspace'),
  define(PermissionKey.LISTING_VERIFY, 'Verify / approve a listing before it goes live'),
  define(PermissionKey.CONTENT_MANAGE, 'Manage marketing and content pages'),
];

const GUEST_PERMS: PermissionKey[] = [
  PermissionKey.LISTING_READ,
  PermissionKey.RESERVATION_CREATE,
  PermissionKey.RESERVATION_READ,
  PermissionKey.RESERVATION_CANCEL,
  PermissionKey.REVIEW_CREATE,
  PermissionKey.REVIEW_READ,
];

const HOST_OPERATOR_PERMS: PermissionKey[] = [
  PermissionKey.LISTING_READ,
  PermissionKey.LISTING_CREATE,
  PermissionKey.LISTING_UPDATE,
  PermissionKey.LISTING_PUBLISH,
  PermissionKey.AVAILABILITY_MANAGE,
  PermissionKey.PRICING_MANAGE,
  PermissionKey.RESERVATION_READ,
  PermissionKey.RESERVATION_CONFIRM,
  PermissionKey.REVIEW_READ,
  PermissionKey.REVIEW_RESPOND,
];

// Strict superset of operator (acceptance criterion): operator perms + org management.
const HOST_OWNER_PERMS: PermissionKey[] = [
  ...HOST_OPERATOR_PERMS,
  PermissionKey.MEMBER_MANAGE,
  PermissionKey.BILLING_READ,
  PermissionKey.BILLING_MANAGE,
];

const ADMIN_PERMS: PermissionKey[] = [
  PermissionKey.USER_READ,
  PermissionKey.USER_MANAGE,
  PermissionKey.ROLE_READ,
  PermissionKey.ROLE_MANAGE,
  PermissionKey.PERMISSION_READ,
  PermissionKey.HOST_ONBOARD,
  PermissionKey.LISTING_VERIFY,
  PermissionKey.CONTENT_MANAGE,
];

/** Role → the set of permissions it grants. */
export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  [RoleName.GUEST]: GUEST_PERMS,
  [RoleName.HOST_OPERATOR]: HOST_OPERATOR_PERMS,
  [RoleName.HOST_OWNER]: HOST_OWNER_PERMS,
  [RoleName.ADMIN]: ADMIN_PERMS,
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  [RoleName.GUEST]: 'Guest — browse listings, book a stay, review it afterwards',
  [RoleName.HOST_OPERATOR]:
    'Host desk — manage listings, availability, pricing, reservations and review replies',
  [RoleName.HOST_OWNER]: 'Host owner — everything an operator can do, plus members & billing',
  [RoleName.ADMIN]: 'Internal staff — onboard hosts, verify listings, ops & support',
};

/** All valid permission keys (for validation / catalog checks). */
export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PermissionKey);

/** Permissions belonging to one resource — the frontend groups the matrix by this. */
export const permissionsForResource = (resource: string): PermissionDef[] =>
  PERMISSIONS.filter((p) => p.resource === resource);
