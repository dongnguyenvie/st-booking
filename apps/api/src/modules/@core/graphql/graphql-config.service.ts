import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';

/**
 * GraphQL options factory — code-first schema generation with Apollo v5.
 * Auto-generates schema.gql from decorators (@ObjectType, @Resolver, etc).
 */
@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    const isProduction = this.configService.get<boolean>('env.isProduction');

    return {
      driver: ApolloDriver,

      // Code-first: auto-generate schema from decorators (output to project root, not src/)
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,

      // Pass req/res into GQL context so guards can access them
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),

      // Introspection + sandbox in non-production
      introspection: !isProduction,
      playground: false,

      // Disable CSRF prevention in dev so browser can access Apollo Sandbox at /graphql
      csrfPrevention: isProduction,

      // Include stack traces in errors during development
      includeStacktraceInErrorResponses: !isProduction,

      // Subscriptions via graphql-ws (modern protocol)
      subscriptions: {
        'graphql-ws': {
          onConnect: (ctx: any) => {
            // Merge connection params headers into request for JWT extraction
            const req = ctx?.extra?.request ?? {};
            const headers = {
              ...req.headers,
              ...(ctx?.connectionParams?.headers ?? {}),
            };
            return { req: { ...req, headers } };
          },
        },
      },
    };
  }
}
