import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'api-service/schema.gql',
  documents: ['api-service/modules/**/*.gql'],
  ignoreNoDocuments: true,
  generates: {
    'api-service/generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        skipTypename: true,
        enumsAsTypes: false,
        namingConvention: {
          enumValues: 'keep',
        },
      },
    },
  },
};

export default config;
