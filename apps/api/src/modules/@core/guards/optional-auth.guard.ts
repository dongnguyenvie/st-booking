import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * Always lets the request through, but populates `req.user` when a valid bearer
 * token is present.
 *
 * Use on public reads that personalise for a signed-in caller without requiring
 * auth — e.g. the market board can show which lenders a borrower has already
 * dealt with, while still rendering for an anonymous visitor.
 */
@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  private readonly bypassAuth: boolean;

  constructor(config: ConfigService) {
    super();
    this.bypassAuth = config.get<string>('BYPASS_AUTH') === 'true';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.bypassAuth) return true;
    try {
      await super.canActivate(context);
    } catch {
      // Swallow — the request continues anonymously.
    }
    return true;
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest<T>(_err: Error | null, user: T | false): T | undefined {
    return user || undefined;
  }
}
