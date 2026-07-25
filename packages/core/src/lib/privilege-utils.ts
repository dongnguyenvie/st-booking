import { Privilege } from '../enums/privilege.enum';

/** Human-readable label for each privilege value */
export const PRIVILEGE_LABELS: Record<number, string> = {
  [Privilege.SUPER_ADMIN]: 'Super Admin',
};

/**
 * Descending priority order for privilege resolution: highest tier wins.
 * Only SUPER_ADMIN remains — marketplace authority now lives in Role.
 */
export const PRIVILEGE_PRIORITY = [Privilege.SUPER_ADMIN] as const;

/**
 * Return the highest-priority privilege from the user's privilege list.
 * Falls back to the first available, or null if empty.
 */
export function getDefaultPrivilege(privileges: number[]): number | null {
  for (const p of PRIVILEGE_PRIORITY) {
    if (privileges.includes(p)) return p;
  }
  return privileges[0] ?? null;
}
