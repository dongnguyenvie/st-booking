import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { bizTags as toBizTags } from './cache.util';

const TAG_PREFIX = 'cache_tag:';

/**
 * Tag-aware cache over Redis. Every cached key is also registered in a Redis set
 * per tag, so a mutation can wipe a whole family of entries by tag (typically
 * businessId-scoped). All methods fail-open: on any Redis error they behave as a
 * cache miss / no-op so requests keep working.
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly redis: RedisService) {}

  private get client() {
    return this.redis.getClient();
  }

  /** Parsed value, or undefined on miss / any Redis error. */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const raw = await this.client.get(key);
      if (raw === null || raw === undefined) return undefined;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.warn(`cache get failed key=${key}: ${(err as Error)?.message}`);
      return undefined;
    }
  }

  /** Store value and register the key under each tag. Swallows Redis errors. */
  async set(key: string, value: unknown, opts: { ttl?: number; tags?: string[] } = {}): Promise<void> {
    const { ttl, tags = [] } = opts;
    try {
      const payload = JSON.stringify(value);
      const pipeline = this.client.multi();
      if (ttl && ttl > 0) pipeline.set(key, payload, 'EX', ttl);
      else pipeline.set(key, payload);
      for (const tag of tags) {
        const tagKey = `${TAG_PREFIX}${tag}`;
        pipeline.sadd(tagKey, key);
        if (ttl && ttl > 0) pipeline.expire(tagKey, ttl);
      }
      await pipeline.exec();
    } catch (err) {
      this.logger.warn(`cache set failed key=${key}: ${(err as Error)?.message}`);
    }
  }

  /** Delete every cache entry registered under the given tag(s). Returns keys deleted. */
  async invalidateByTags(tags: string | string[]): Promise<number> {
    const list = Array.isArray(tags) ? tags : [tags];
    if (!list.length) return 0;
    let deleted = 0;
    try {
      for (const tag of list) {
        const tagKey = `${TAG_PREFIX}${tag}`;
        const keys = await this.client.smembers(tagKey);
        if (keys.length) deleted += await this.client.del(...keys);
        await this.client.del(tagKey);
      }
    } catch (err) {
      this.logger.warn(`cache invalidate failed tags=${list.join(',')}: ${(err as Error)?.message}`);
    }
    return deleted;
  }

  /** Convenience for mutation services: invalidate businessId-scoped tags. */
  async invalidateBizTags(tags: string[], businessId: string): Promise<number> {
    return this.invalidateByTags(toBizTags(tags, businessId));
  }
}
