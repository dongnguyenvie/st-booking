import { BACKEND_API } from '@/core/config';
import { GraphQLClient } from 'graphql-request';

/** Returns auth header from stored token (client-side only) */
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('carousel_marketplace_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Singleton GraphQL client with dynamic auth headers */
export const gqlClient = new GraphQLClient(BACKEND_API.graphql, {
  headers: () => getAuthHeaders(),
});

/**
 * Fetcher factory for @graphql-codegen/typescript-react-query.
 * Returns a thunk so TanStack Query can call it lazily.
 */
export function fetcher<TData, TVariables>(
  // Accept String object (TypedDocumentString extends String) as well as string primitive
  document: string | String,
  variables?: TVariables,
  // headers param accepted for compatibility with generated .fetcher static methods
  _headers?: RequestInit['headers'],
): () => Promise<TData> {
  return () => gqlClient.request<TData>(document.toString(), variables as Record<string, unknown>);
}
