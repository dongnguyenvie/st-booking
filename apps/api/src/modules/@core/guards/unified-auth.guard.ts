import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export const IS_PROTECTED_KEY = 'isProtected';

/**
 * Opt-in JWT guard for both REST and GraphQL.
 * Route is public by default — protected only when @PoliciesGuard() is applied,
 * which sets IS_PROTECTED_KEY metadata.
 */
@Injectable()
export class UnifiedAuthGuard extends AuthGuard('jwt') {
  private readonly bypassAuth: boolean;

  constructor(
    private readonly reflector: Reflector,
    config: ConfigService,
  ) {
    super();
    this.bypassAuth = config.get<string>('BYPASS_AUTH') === 'true';
  }

  canActivate(context: ExecutionContext) {
    if (this.bypassAuth) return true;

    const isProtected = this.reflector.getAllAndOverride<boolean>(IS_PROTECTED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // No @PoliciesGuard() applied — route is public
    if (!isProtected) return true;
    return super.canActivate(context);
  }

  /** Extract request from either GQL or HTTP context */
  getRequest(context: ExecutionContext) {
    if (context.getType<GqlContextType>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest<T>(err: Error, user: T): T {
    if (err || !user) throw err || new UnauthorizedException();
    return user;
  }
}
