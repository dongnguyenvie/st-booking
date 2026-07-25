/**
 * The seeded roles — the three top-level actor types, with Host split in two.
 *
 * A Role grants a fixed PermissionKey set (see ROLE_PERMISSIONS); HOST_OWNER's
 * set is a strict superset of HOST_OPERATOR's. SUPER_ADMIN is deliberately not
 * here — it is a break-glass Privilege flag, not a role.
 *
 * The *value* is persisted (roles.name) and matched by the seed, so renaming a
 * member is safe but changing its string value is a migration.
 */
export enum RoleName {
  GUEST = 'guest',
  HOST_OWNER = 'host_owner',
  HOST_OPERATOR = 'host_operator',
  ADMIN = 'admin',
}
