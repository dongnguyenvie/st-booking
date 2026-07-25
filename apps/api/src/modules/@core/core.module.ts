import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { validate } from './config/env-validation';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './logger/logger.module';
import { RoleCacheService } from './services/role-cache.service';
import { UnifiedAuthGuard } from './guards/unified-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { CryptoModule } from './crypto/crypto.module';
import { EmailModule } from './email/email.module';
import { RateLimiterService } from './rate-limit/rate-limiter.service';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { CacheModule } from './cache/cache.module';
import { StorageService } from './storage/storage.service';
import { OptionalAuthGuard } from './guards/optional-auth.guard';
import { IdempotencyLockGuard } from './decorators/idempotency-guard.decorator';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      expandVariables: true,
    }),
    PrismaModule,
    RedisModule,
    LoggerModule,
    CryptoModule,
    EmailModule,
    CacheModule,
  ],
  providers: [
    RoleCacheService,
    UnifiedAuthGuard,
    PermissionsGuard,
    RateLimiterService,
    RateLimitGuard,
    StorageService,
    OptionalAuthGuard,
    IdempotencyLockGuard,
  ],
  exports: [
    PrismaModule,
    RedisModule,
    LoggerModule,
    RoleCacheService,
    UnifiedAuthGuard,
    PermissionsGuard,
    CryptoModule,
    EmailModule,
    CacheModule,
    RateLimiterService,
    RateLimitGuard,
    StorageService,
    OptionalAuthGuard,
    IdempotencyLockGuard,
  ],
})
export class CoreModule {}
