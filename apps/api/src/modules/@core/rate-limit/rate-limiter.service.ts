import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@core/redis/redis.service';

/**
 * Fixed-window rate limiter on Redis INCR. Multi-node correct by construction
 * (an in-process Map counts per-instance, so N pods allow N x the limit).
 *
 * Fails OPEN when Redis is down — availability of sign-in beats throttling
 * strictness. RedisService itself already boots without a live connection.
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);

  constructor(private readonly redis: RedisService) {}

  /** true = allowed; false = over the limit for this window. */
  async consume(key: string, limit: number, windowS: number): Promise<boolean> {
    try {
      const client = this.redis.getClient();
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, windowS);
      }
      return count <= limit;
    } catch (e) {
      this.logger.warn(`Rate limiter unavailable (${String(e)}) — failing open`);
      return true;
    }
  }
}
