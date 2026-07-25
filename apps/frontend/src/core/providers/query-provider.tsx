'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/** Wraps children with TanStack Query — placed in root layout via AppProviders */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create per-request client to avoid shared state between users (SSR-safe)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
