import { SetMetadata } from '@nestjs/common';

export const CACHE_METADATA_KEY = 'CACHE_OPTIONS';

export interface CacheOptions {
  /** TTL in seconds (default 30). Function form is evaluated per request. */
  ttl?: number | (() => number);
  /** Extra input params folded into the cache key */
  keyParams?: string[];
  /** Extra user fields folded into the cache key (businessId is always included) */
  userKeyFields?: string[];
  /** Fold the requested GraphQL field selection into the key (default true) */
  includeResponseInKey?: boolean;
  /** Static or dynamic invalidation tags */
  tags?: string[] | ((args: any, user: any) => string[]);
  /** Tags auto-scoped with businessId, e.g. ['getUsers'] => ['getUsers:<bizId>'] */
  bizTags?: string[];
  /** Emit the default tag "<apiName>:<bizId>" (default true) */
  useApiTag?: boolean;
  /** Use the input `id` as an invalidation tag (default false) */
  useIdAsTag?: boolean;
}

/**
 * Mark a resolver/controller handler as cacheable.
 * Defaults are resolved in ApiCacheInterceptor (registered globally by CacheModule),
 * so the stored metadata stays exactly what the caller passed.
 */
export const CacheAPI = (options: CacheOptions = {}): MethodDecorator =>
  SetMetadata(CACHE_METADATA_KEY, options);
