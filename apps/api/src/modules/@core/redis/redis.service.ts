import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      password: this.configService.get<string>('redis.password') || undefined,
      db: this.configService.get<number>('redis.db'),
      lazyConnect: true,
    });

    this.client.on('error', (err) => this.logger.error('Redis error', err));
    this.client.on('connect', () => this.logger.log('Redis connected'));

    try {
      await this.client.connect();
    } catch (error) {
      this.logger.warn('Redis connection failed — continuing without cache');
    }
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  /** Returns raw ioredis client — use for BullMQ connection sharing */
  getClient(): Redis {
    return this.client;
  }

  /**
   * Take a distributed lock (SET NX EX). Returns false if someone already holds it.
   *
   * `token` should be a value unique to this caller so the lock can be released
   * safely later — see releaseLockIfOwner.
   */
  async acquireLock(lockKey: string, ttlSeconds = 60, token = 'locked'): Promise<boolean> {
    const result = await this.client.set(lockKey, token, 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  /**
   * Release a lock only if we still hold it.
   *
   * Guards the classic distributed-lock footgun: if our TTL expired mid-run,
   * another caller may already hold the lock and deleting it blindly would free
   * theirs. The GET+DEL runs as one Lua script so the check cannot race.
   *
   * @returns 1 when released, 0 when the lock was missing or owned by someone else.
   */
  async releaseLockIfOwner(lockKey: string, token: string): Promise<number> {
    const script = `if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end`;
    const result = await this.client.eval(script, 1, lockKey, token);
    return typeof result === 'number' ? result : 0;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const count = await this.client.exists(key);
    return count > 0;
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }
}
