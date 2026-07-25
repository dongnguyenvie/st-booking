import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphqlConfigService } from './graphql-config.service';
import { DateScalar } from './scalars/date.scalar';
import { HealthResolver } from './health.resolver';

// @Global() makes GraphQLModule (and its GraphQLSchemaHost provider) available
// to all feature modules without needing to import GraphqlModule explicitly.
@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GraphqlConfigService,
    }),
  ],
  providers: [DateScalar, HealthResolver],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
