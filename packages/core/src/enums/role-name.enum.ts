/**
 * The seeded roles — the three top-level actor types, with Lender split in two.
 *
 * A Role grants a fixed PermissionKey set (see ROLE_PERMISSIONS); LENDER_OWNER's
 * set is a strict superset of LENDER_OPERATOR's. SUPER_ADMIN is deliberately not
 * here — it is a break-glass Privilege flag, not a role.
 *
 * The *value* is persisted (roles.name) and matched by the seed, so renaming a
 * member is safe but changing its string value is a migration.
 */
export enum RoleName {
  BORROWER = 'borrower',
  LENDER_OWNER = 'lender_owner',
  LENDER_OPERATOR = 'lender_operator',
  ADMIN = 'admin',
}
