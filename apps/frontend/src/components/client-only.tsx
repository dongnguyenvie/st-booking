'use client';

import { useEffect, useState } from 'react';

/**
 * Shared wrapper that renders children only on the client (no SSR).
 * Useful for components that rely on browser APIs.
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}
