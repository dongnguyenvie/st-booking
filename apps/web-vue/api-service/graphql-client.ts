import { createClient, defaultPlugins } from 'villus';

/**
 * Creates a villus GraphQL client.
 * Reads token from pinia-plugin-persistedstate storage (key: 'auth') to avoid
 * circular Pinia dependency. The plugin stores the full state as JSON under the store id.
 */
export function createGraphQLClient(graphqlUrl: string) {
  return createClient({
    url: graphqlUrl,
    use: [
      // Auth header plugin — injects Bearer token on every request
      ({ opContext }) => {
        try {
          const raw = localStorage.getItem('auth');
          const token = raw ? (JSON.parse(raw) as { token?: string }).token : null;
          if (token) {
            opContext.headers = {
              ...opContext.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        } catch {
          // Ignore parse errors — request proceeds without auth header
        }
      },
      ...defaultPlugins(),
    ],
  });
}
