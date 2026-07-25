import { BACKEND_API } from '@/core/config';

/** Unwrapped REST response envelope from TransformResponseInterceptor */
interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('carousel_marketplace_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Fetch a REST endpoint and unwrap the `{ data }` envelope */
async function restFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_API.restAPI}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const json: ApiEnvelope<T> = await res.json();

  if (!res.ok) {
    throw new Error((json as any).message ?? `Request failed: ${res.status}`);
  }

  return json.data;
}

export const restClient = {
  get: <T>(path: string) => restFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    restFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    restFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => restFetch<T>(path, { method: 'DELETE' }),
};
