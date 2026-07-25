import { Query, Resolver } from '@nestjs/graphql';

/** Bootstrap resolver — provides the required Query root type for GraphQL schema. */
@Resolver()
export class HealthResolver {
  @Query(() => String, { description: 'GraphQL health check' })
  gqlHealth(): string {
    return 'ok';
  }
}
