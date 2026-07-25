/**
 * Numeric privilege flags stored in User.privileges[].
 *
 * This is now a bootstrap-only escape hatch: the ONLY meaningful value is
 * SUPER_ADMIN, a break-glass superuser that bypasses RBAC. All ordinary
 * booking authority (guest / host / admin) is granted through Role
 * (see the roles / user_roles tables), NOT here.
 *
 * The numeric value is load-bearing — it is persisted in User.privileges and
 * encoded into issued JWTs — so renaming the member is safe but renumbering
 * it is not.
 */
export enum Privilege {
  SUPER_ADMIN = 1,
}
