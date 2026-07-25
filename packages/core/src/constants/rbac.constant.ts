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
  // Borrower — request lifecycle
  define(PermissionKey.REQUEST_CREATE, 'Create a financing request'),
  define(PermissionKey.REQUEST_READ, 'View a request'),
  define(PermissionKey.REQUEST_CANCEL, 'Cancel / abandon a request'),
  define(PermissionKey.OFFER_READ, 'View offers on a request'),
  define(PermissionKey.LOI_SIGN, 'Sign an LOI (pick an offer)'),
  define(PermissionKey.LOI_CANCEL, 'Cancel an LOI (release exclusivity)'),

  // Lender desk — pricing & funding
  define(PermissionKey.REQUEST_UNLOCK, 'Pay to unlock a full request Dossier (Model A)'),
  define(PermissionKey.OFFER_POST, 'Post an offer on a request'),
  define(PermissionKey.OFFER_REVISE, 'Send revised terms after LOI'),
  define(PermissionKey.STIP_REQUEST, 'Request a stipulation'),
  define(PermissionKey.STIP_REVIEW, 'Review a submitted stipulation'),
  define(PermissionKey.STIP_APPROVE, 'Approve or return a stipulation'),
  define(PermissionKey.FUNDING_CONFIRM, 'Confirm funding (click "funded")'),

  // Lender owner — org management
  define(PermissionKey.MEMBER_MANAGE, 'Invite and manage workspace members'),
  define(PermissionKey.BILLING_READ, 'View billing / the workspace ledger'),
  define(PermissionKey.BILLING_MANAGE, 'Manage billing and payment methods'),

  // Admin — internal ops
  define(PermissionKey.USER_READ, 'View users'),
  define(PermissionKey.USER_MANAGE, 'Manage users'),
  define(PermissionKey.ROLE_READ, 'View roles and their permissions'),
  define(PermissionKey.ROLE_MANAGE, 'Create / edit roles and assignments'),
  define(PermissionKey.PERMISSION_READ, 'View the permission catalog'),
  define(PermissionKey.LENDER_ONBOARD, 'Onboard a Lender Workspace'),
  define(PermissionKey.WORKSPACE_VERIFY, 'Verify / approve a Lender Workspace'),
];

const BORROWER_PERMS: PermissionKey[] = [
  PermissionKey.REQUEST_CREATE,
  PermissionKey.REQUEST_READ,
  PermissionKey.REQUEST_CANCEL,
  PermissionKey.OFFER_READ,
  PermissionKey.LOI_SIGN,
  PermissionKey.LOI_CANCEL,
];

const LENDER_OPERATOR_PERMS: PermissionKey[] = [
  PermissionKey.REQUEST_READ,
  PermissionKey.REQUEST_UNLOCK,
  PermissionKey.OFFER_POST,
  PermissionKey.OFFER_REVISE,
  PermissionKey.STIP_REQUEST,
  PermissionKey.STIP_REVIEW,
  PermissionKey.STIP_APPROVE,
  PermissionKey.FUNDING_CONFIRM,
];

// Strict superset of operator (acceptance criterion): operator perms + org management.
const LENDER_OWNER_PERMS: PermissionKey[] = [
  ...LENDER_OPERATOR_PERMS,
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
  PermissionKey.LENDER_ONBOARD,
  PermissionKey.WORKSPACE_VERIFY,
];

/** Role → the set of permissions it grants. */
export const ROLE_PERMISSIONS: Record<RoleName, PermissionKey[]> = {
  [RoleName.BORROWER]: BORROWER_PERMS,
  [RoleName.LENDER_OPERATOR]: LENDER_OPERATOR_PERMS,
  [RoleName.LENDER_OWNER]: LENDER_OWNER_PERMS,
  [RoleName.ADMIN]: ADMIN_PERMS,
};

export const ROLE_DESCRIPTIONS: Record<RoleName, string> = {
  [RoleName.BORROWER]: 'Borrower — create requests, compare offers, sign an LOI',
  [RoleName.LENDER_OPERATOR]:
    'Lender desk — price requests, post offers, review stips, confirm funding',
  [RoleName.LENDER_OWNER]: 'Lender owner — everything an operator can do, plus members & billing',
  [RoleName.ADMIN]: 'Internal staff — onboard/verify lenders, ops & support',
};

/** All valid permission keys (for validation / catalog checks). */
export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PermissionKey);

/** Permissions belonging to one resource — the frontend groups the matrix by this. */
export const permissionsForResource = (resource: string): PermissionDef[] =>
  PERMISSIONS.filter((p) => p.resource === resource);
