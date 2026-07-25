import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  // Use local schema file (run `pnpm sync-schema` after API generates it)
  // To pull live from running API instead: replace with 'http://localhost:4000/graphql'
  schema: 'src/api-service/schema.gql',
  documents: ['src/api-service/modules/**/*.gql'],
  ignoreNoDocuments: true,
  generates: {
    // Shared types + operation types (input/output shapes, variables)
    'src/api-service/generated/graphql.generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        skipTypename: true,
        enumsAsTypes: false,
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
    // TanStack Query v5 hooks — useGetUsersQuery, useCreateApiKeyMutation, etc.
    'src/api-service/generated/graphql-hooks.generated.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: './graphql.generated',
      },
      plugins: [
        // typescript-react-query (documentMode: 'string') references a
        // TypedDocumentString class but does not emit it — provide the shim.
        {
          add: {
            content: 'class TypedDocumentString<TResult, TVariables> extends String {}',
          },
        },
        'typescript-react-query',
        { add: { content: "export * from './graphql.generated'" } },
      ],
      config: {
        fetcher: '@/api-service/graphql-client#fetcher',
        reactQueryVersion: 5,
        skipTypename: true,
        enumsAsTypes: false,
        exposeQueryKeys: true,
        exposeFetcher: true,
        documentMode: 'string',
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
    // graphql-request SDK (used by gqlClient directly when hooks are not needed)
    'src/api-service/generated/graphql-request.generated.ts': {
      preset: 'import-types',
      presetConfig: {
        typesPath: './graphql.generated',
      },
      plugins: [
        'typescript-graphql-request',
        { add: { content: '// @ts-nocheck' } },
        { add: { content: "export * from './graphql.generated'" } },
      ],
      config: {
        noExport: true,
        documentMode: 'external',
        importDocumentNodeExternallyFrom: './graphql.generated',
        skipTypenameInOperations: true,
      },
    },
  },
};

export default config;
