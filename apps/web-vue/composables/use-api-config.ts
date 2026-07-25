/**
 * Composable to build API URLs from runtime config.
 */
export function useApiConfig() {
  const config = useRuntimeConfig();
  const protocol = config.public.useSsl === 'true' ? 'https' : 'http';
  const wsProtocol = config.public.useSsl === 'true' ? 'wss' : 'ws';
  const endpoint = config.public.apiEndpoint;

  return {
    /** Full GraphQL endpoint URL */
    graphqlUrl: `${protocol}://${endpoint}/graphql`,

    /** REST API base URL */
    restUrl: `${protocol}://${endpoint}`,

    /** WebSocket URL for subscriptions */
    wsUrl: `${wsProtocol}://${endpoint}/graphql`,
  };
}
