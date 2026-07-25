import { createHash } from 'crypto';

/** Stable sha256 hex of a trimmed string. */
export function sha256Hex(input: string): string {
  return createHash('sha256')
    .update((input || '').trim())
    .digest('hex');
}

/**
 * Short, stable digest used to build cache and lock keys.
 *
 * MD5 is fine here and deliberately chosen for length: these values are never
 * security-bearing, they only need to collapse an argument into a compact,
 * deterministic key fragment.
 */
export function hashToMd5(input: string | object | unknown[]): string {
  const raw = typeof input === 'string' ? input : JSON.stringify(input);
  return createHash('md5').update(raw).digest('hex');
}
