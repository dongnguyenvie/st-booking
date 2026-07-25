'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/components/button';

/** Root-level error boundary — catches unhandled errors in the entire app */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: send to Sentry / error tracking
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-4xl font-bold">500</h1>
          <p className="text-muted-foreground">Something went wrong.</p>
          {error.digest && <p className="text-xs text-muted-foreground font-mono">ID: {error.digest}</p>}
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
