import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { RateLimiterService } from './rate-limiter.service';

export const RATE_LIMIT_KEY = 'rateLimit';

export interface RateLimitOptions {
  /** Max requests per window per client IP. */
  limit: number;
  windowS: number;
  /** Redis key prefix — defaults to Class.handler. */
  keyPrefix?: string;
}

interface RequestLike {
  ip?: string;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions | undefined>(RATE_LIMIT_KEY, context.getHandler());
    if (!options) return true;

    const prefix = options.keyPrefix ?? `${context.getClass().name}.${context.getHandler().name}`;
    const ok = await this.rateLimiter.consume(
      `rl:${prefix}:${this.clientIp(context)}`,
      options.limit,
      options.windowS,
    );
    if (!ok) {
      throw new HttpException('Too many requests — slow down', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }

  private clientIp(context: ExecutionContext): string {
    const req: RequestLike | undefined =
      context.getType<GqlContextType>() === 'graphql'
        ? GqlExecutionContext.create(context).getContext<{ req?: RequestLike }>().req
        : context.switchToHttp().getRequest<RequestLike>();
    const forwarded = req?.headers?.['x-forwarded-for'];
    const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
    return (first ?? req?.ip ?? req?.socket?.remoteAddress ?? 'unknown').trim();
  }
}

/** Per-IP fixed-window rate limit on one route. */
export function RateLimit(options: RateLimitOptions) {
  return applyDecorators(SetMetadata(RATE_LIMIT_KEY, options), UseGuards(RateLimitGuard));
}
