import { createGraphQLClient } from '~/api-service/graphql-client';

/**
 * Client-only villus plugin.
 * Reads API config from runtimeConfig directly to avoid Pinia dependency.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const protocol = String(config.public.useSsl) === 'true' ? 'https' : 'http';
  const graphqlUrl = `${protocol}://${config.public.apiEndpoint}/graphql`;

  const client = createGraphQLClient(graphqlUrl);
  nuxtApp.vueApp.use(client);
});
