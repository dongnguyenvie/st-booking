import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheService } from './cache.service';
import { ApiCacheInterceptor } from './cache.interceptor';

/**
 * Registers the tag-aware CacheService (injectable everywhere) and the global
 * ApiCacheInterceptor that activates @CacheAPI on any resolver/controller.
 * RedisService comes from the global RedisModule.
 */
@Global()
@Module({
  providers: [CacheService, { provide: APP_INTERCEPTOR, useClass: ApiCacheInterceptor }],
  exports: [CacheService],
})
export class CacheModule {}
