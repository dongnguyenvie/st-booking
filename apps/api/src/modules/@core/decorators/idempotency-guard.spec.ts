import { describe, it, expect, jest } from '@jest/globals';
import { HttpException } from '@nestjs/common';
import { IdempotencyLockGuard, IDEMPOTENCY_OPTIONS_KEY } from './idempotency-guard.decorator';

/** Minimal in-memory stand-in for the Redis SET NX / owner-checked DEL pair. */
function makeRedis() {
  const store = new Map<string, string>();
  return {
    store,
    acquireLock: jest.fn(async (key: string, _ttl: number, token: string) => {
      if (store.has(key)) return false;
      store.set(key, token);
      return true;
    }),
    releaseLockIfOwner: jest.fn(async (key: string, token: string) => {
      if (store.get(key) !== token) return 0;
      store.delete(key);
      return 1;
    }),
  };
}

/**
 * GqlExecutionContext reads the resolver 4-tuple [root, args, context, info]
 * off the raw context, so the fake has to hand back an array, not the args
 * object — returning the object makes GqlExecutionContext.create() throw.
 */
function makeContext(
  args: Record<string, unknown>,
  res: { on: (e: string, cb: () => void) => void } = { on: () => undefined },
  handlerName = 'signLoi',
) {
  const req = { ip: '10.0.0.1' };
  return {
    getHandler: () => ({ name: handlerName }),
    getClass: () => ({ name: 'LoiResolver' }),
    getType: () => 'graphql',
    getArgs: () => [undefined, args, { req, res }, undefined],
    getArgByIndex: (i: number) => [undefined, args, { req, res }, undefined][i],
    switchToHttp: () => ({ getRequest: () => req }),
  } as never;
}

function makeReflector(options: unknown) {
  return { get: (key: string) => (key === IDEMPOTENCY_OPTIONS_KEY ? options : undefined) } as never;
}

describe('IdempotencyLockGuard', () => {
  it('passes through when the handler is not decorated', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector(undefined), redis as never);

    await expect(guard.canActivate(makeContext({}))).resolves.toBe(true);
    expect(redis.acquireLock).not.toHaveBeenCalled();
  });

  it('blocks a second in-flight call for the same resource', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector({ fields: ['offerId'] }), redis as never);
    const ctx = makeContext({ input: { offerId: 'o-sutton' } });

    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    // Second click on Sign, before the first finished.
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(HttpException);
  });

  it('lets a different resource through concurrently', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector({ fields: ['offerId'] }), redis as never);

    await expect(guard.canActivate(makeContext({ input: { offerId: 'o-sutton' } }))).resolves.toBe(true);
    await expect(guard.canActivate(makeContext({ input: { offerId: 'o-beacon' } }))).resolves.toBe(true);
  });

  it('keys on falsy-but-real values rather than dropping them', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector({ fields: ['amount'] }), redis as never);

    await expect(guard.canActivate(makeContext({ input: { amount: 0 } }))).resolves.toBe(true);
    // 0 must have produced a real key, so the repeat is blocked.
    await expect(guard.canActivate(makeContext({ input: { amount: 0 } }))).rejects.toBeInstanceOf(
      HttpException,
    );
    // …and must not collide with a different amount.
    await expect(guard.canActivate(makeContext({ input: { amount: 5 } }))).resolves.toBe(true);
  });

  it('releases the lock when the response finishes, freeing the next call', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector({ fields: ['offerId'] }), redis as never);

    let onFinish: (() => void) | undefined;
    const ctx = makeContext(
      { input: { offerId: 'o-sutton' } },
      { on: (_e: string, cb: () => void) => { onFinish = cb; } },
    );

    await guard.canActivate(ctx);
    onFinish?.();
    await new Promise((r) => setImmediate(r));

    expect(redis.store.size).toBe(0);
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
  });

  it('falls back to the caller IP when no fields are configured', async () => {
    const redis = makeRedis();
    const guard = new IdempotencyLockGuard(makeReflector({ fields: [] }), redis as never);

    await expect(guard.canActivate(makeContext({}))).resolves.toBe(true);
    await expect(guard.canActivate(makeContext({}))).rejects.toBeInstanceOf(HttpException);
  });
});
