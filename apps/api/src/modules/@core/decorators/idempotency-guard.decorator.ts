import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { randomBytes } from 'crypto';
import { RedisService } from '@core/redis/redis.service';
import { hashToMd5 } from '@core/utils/hash';

export const IDEMPOTENCY_OPTIONS_KEY = 'idempotency:options';

const LOCK_PREFIX = 'idempotency-lock';

/** Minimal dot-path read — avoids pulling in lodash for one lookup. */
function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, source);
}

/**
 * Blocks a second concurrent execution of the same operation using a Redis
 * lock. This is a mutex, not a rate limit: it permits any number of requests
 * over time but exactly one in flight per key.
 *
 * It matters most where a double-fire changes money or state that cannot be
 * un-done — signing an LOI, posting an offer, approving a stip. A duplicate
 * click or a retried mutation must not create two of them.
 *
 * Lock key: `idempotency-lock:{handler}:{md5(field:value)|…}`
 */
@Injectable()
export class IdempotencyLockGuard implements CanActivate {
  private readonly logger = new Logger(IdempotencyLockGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<IdempotencyGuardOptions>(
      IDEMPOTENCY_OPTIONS_KEY,
      context.getHandler(),
    );
    if (!options) return true;

    const lockKey = this.buildLockKey(context, options);
    const ttlSeconds = Math.max(1, Math.ceil((options.ttl ?? 10_000) / 1000));
    const token = randomBytes(16).toString('hex');

    const acquired = await this.redis.acquireLock(lockKey, ttlSeconds, token);
    if (!acquired) {
      this.logger.warn(`Blocked concurrent request: ${lockKey}`);
      throw new HttpException(
        options.message ?? 'Operation already in progress. Please wait.',
        HttpStatus.CONFLICT,
      );
    }

    // Release when the response finishes, success or error. Without a response
    // object we let the TTL expire it rather than guessing a delay.
    const res = this.getResponse(context);
    if (res?.on) {
      res.on('finish', () => {
        void this.redis.releaseLockIfOwner(lockKey, token).catch(() => undefined);
      });
    }

    return true;
  }

  private buildLockKey(context: ExecutionContext, options: IdempotencyGuardOptions): string {
    return `${LOCK_PREFIX}:${context.getHandler().name}:${this.buildTracker(context, options)}`;
  }

  /**
   * Hash the configured argument values into the key. Falls back to the caller
   * IP when no fields are configured or none are present.
   */
  private buildTracker(context: ExecutionContext, options: IdempotencyGuardOptions): string {
    const fields = options.fields ?? [];

    if (fields.length > 0) {
      const args = GqlExecutionContext.create(context).getArgs() as Record<string, unknown>;
      const trackers: string[] = [];

      for (const field of fields) {
        // `@Args('input')` is the common shape, so look there first, then root.
        // Null/undefined is checked explicitly so falsy-but-real values
        // (0, false, '') still contribute to the key.
        const nested = readPath(args, `input.${field}`);
        const value = nested !== undefined && nested !== null ? nested : readPath(args, field);
        if (value !== undefined && value !== null) {
          trackers.push(hashToMd5(`${field}:${String(value)}`));
        }
      }

      if (trackers.length > 0) return trackers.join('|');
    }

    const req = this.getRequest(context);
    return hashToMd5(`ip:${req?.ip ?? req?.socket?.remoteAddress ?? 'unknown'}`);
  }

  private getRequest(context: ExecutionContext): { ip?: string; socket?: { remoteAddress?: string } } | undefined {
    return GqlExecutionContext.create(context).getContext()?.req;
  }

  private getResponse(context: ExecutionContext): { on?: (e: string, cb: () => void) => void } | undefined {
    return GqlExecutionContext.create(context).getContext()?.res;
  }
}

export interface IdempotencyGuardOptions {
  /**
   * Argument paths that identify the resource, dot-notation allowed.
   * Empty means the lock falls back to handler + caller IP.
   */
  fields?: string[];
  /** Lock TTL in ms — auto-releases if the handler crashes or hangs. @default 10_000 */
  ttl?: number;
  /** Message returned on 409. */
  message?: string;
}

/**
 * Prevent concurrent execution of the same operation.
 *
 * Distinct from the rate limiter: `@RateLimit` caps requests per window,
 * this permits one at a time for a given resource.
 *
 * @example
 * ```typescript
 * // Two clicks on "Sign" must not create two LOIs for one offer.
 * @IdempotencyGuard({ fields: ['offerId'], ttl: 10_000 })
 * @Mutation(() => SignLoiOutput)
 * async signLoi(@Args('input') input: SignLoiInput) { }
 * ```
 */
export function IdempotencyGuard(options: IdempotencyGuardOptions = {}) {
  return applyDecorators(
    SetMetadata(IDEMPOTENCY_OPTIONS_KEY, {
      fields: options.fields ?? [],
      ttl: options.ttl ?? 10_000,
      message: options.message ?? 'Operation already in progress. Please wait.',
    }),
    UseGuards(IdempotencyLockGuard),
  );
}
