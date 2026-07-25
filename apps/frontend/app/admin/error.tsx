'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/components/button';

/** Admin section error boundary — shows inline error without leaving the layout */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AdminError]', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        {error.digest && <p className="text-xs text-muted-foreground font-mono">ID: {error.digest}</p>}
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
