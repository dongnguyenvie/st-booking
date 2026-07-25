import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaSelect } from '@modules/@shared/prisma/prisma-select';
import { CacheService } from './cache.service';
import { CACHE_METADATA_KEY, CacheOptions } from './cache.decorator';
import { bizTag, bizTags as toBizTags, isFunction, md5, pick } from './cache.util';

const DEFAULT_TTL = 30;
const DEFAULT_USER_KEY_FIELDS = ['businessId'];

/**
 * Reads @CacheAPI metadata and serves cached responses for GraphQL and REST.
 * The cache key folds in businessId, selected user fields, chosen input params
 * and (for GraphQL) the requested field selection so different projections cache
 * separately. Registered globally by CacheModule; a no-op when no metadata.
 *
 * NOTE: businessId comes off the JWT principal. This project's tokens do not
 * carry a businessId claim yet, so bizId resolves to '' and the biz-scoping
 * degrades to unscoped (still correct — just coarser). Add the claim in
 * AuthService.generateToken to activate per-tenant keys and tags.
 */
@Injectable()
export class ApiCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cache: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const options = this.reflector.get<CacheOptions>(CACHE_METADATA_KEY, context.getHandler());
    if (!options) return next.handle();

    const isGql = context.getType<GqlContextType>() === 'graphql';
    return isGql ? this.handleGql(context, next, options) : this.handleHttp(context, next, options);
  }

  private handleGql(
    context: ExecutionContext,
    next: CallHandler,
    options: CacheOptions,
  ): Promise<Observable<any>> {
    const gql = GqlExecutionContext.create(context);
    const apiName = context.getHandler().name;
    const args = (gql.getArgs() ?? {}) as Record<string, any>;
    const user = (gql.getContext()?.req?.user ?? {}) as Record<string, any>;

    let select: Record<string, any> = {};
    if (options.includeResponseInKey !== false) {
      try {
        select = new PrismaSelect(gql.getInfo()).valueOf('data')?.select ?? {};
      } catch {
        select = {};
      }
    }

    const input = (args.input ?? {}) as Record<string, any>;
    const key = this.buildKey(
      'gql_cache',
      apiName,
      user,
      pick(input, options.keyParams ?? []),
      select,
      options,
    );
    const tags = this.buildTags(apiName, args, user, options);
    return this.serve(key, tags, options, next);
  }

  private handleHttp(
    context: ExecutionContext,
    next: CallHandler,
    options: CacheOptions,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Record<string, any>>();
    const user = (req?.user ?? {}) as Record<string, any>;
    const method = String(req?.method ?? '').toUpperCase();
    const route = String(req?.route?.path ?? req?.url ?? '');
    const apiName = `${method}:${route}`;
    const args: Record<string, any> = { ...(req?.params ?? {}), ...(req?.query ?? {}), ...(req?.body ?? {}) };

    const key = this.buildKey('rest_cache', apiName, user, pick(args, options.keyParams ?? []), {}, options);
    const tags = this.buildTags(apiName, args, user, options);
    return this.serve(key, tags, options, next);
  }

  private async serve(
    key: string,
    tags: string[],
    options: CacheOptions,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const cached = await this.cache.get(key);
    if (cached !== undefined) return of(cached);

    const ttl = isFunction(options.ttl) ? options.ttl() : (options.ttl ?? DEFAULT_TTL);
    return next.handle().pipe(
      tap((response) => {
        if (response !== undefined) void this.cache.set(key, response, { ttl, tags });
      }),
    );
  }

  private buildKey(
    prefix: string,
    apiName: string,
    user: Record<string, any>,
    paramsKey: Record<string, any>,
    select: Record<string, any>,
    options: CacheOptions,
  ): string {
    const bizId = String(user.businessId ?? '');
    const userKey = pick(user, [...DEFAULT_USER_KEY_FIELDS, ...(options.userKeyFields ?? [])]);
    const hash = md5(JSON.stringify([userKey, paramsKey, select]));
    return `${prefix}:${apiName}:${bizId}:${hash}`;
  }

  private buildTags(
    apiName: string,
    args: Record<string, any>,
    user: Record<string, any>,
    options: CacheOptions,
  ): string[] {
    const bizId = String(user.businessId ?? '');
    const tags: string[] = [];

    if (options.useApiTag !== false) tags.push(bizId ? bizTag(apiName, bizId) : apiName);

    if (options.useIdAsTag) {
      const input = (args.input ?? {}) as Record<string, any>;
      const id = input.id ?? args.id;
      if (id) tags.push(String(id));
    }

    if (options.bizTags?.length && bizId) tags.push(...toBizTags(options.bizTags, bizId));

    if (options.tags) {
      tags.push(...(isFunction(options.tags) ? options.tags(args, user) : options.tags));
    }

    return tags;
  }
}
