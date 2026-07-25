// Small helpers for the API cache layer.
import { createHash } from 'crypto';

export type AnyFn = (...args: any[]) => any;

export function isFunction(value: unknown): value is AnyFn {
  return typeof value === 'function';
}

/** Shallow pick of defined keys — used to build stable cache keys. */
export function pick(obj: Record<string, any> | undefined | null, keys: string[]): Record<string, any> {
  const out: Record<string, any> = {};
  if (!obj) return out;
  for (const key of keys) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

export function md5(input: string): string {
  return createHash('md5').update(input).digest('hex');
}

/** Scope a tag with businessId: ('getUsers', biz) => 'getUsers:biz' */
export function bizTag(tag: string, businessId: string): string {
  return `${tag}:${businessId}`;
}

export function bizTags(tags: string[], businessId: string): string[] {
  return tags.map((tag) => bizTag(tag, businessId));
}
