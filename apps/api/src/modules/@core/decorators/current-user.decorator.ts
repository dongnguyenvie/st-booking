import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

/** Extract authenticated user — works for both REST and GraphQL. Use after @PoliciesGuard(). */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(ctx).getContext().req?.user;
  }
  return ctx.switchToHttp().getRequest().user;
});
