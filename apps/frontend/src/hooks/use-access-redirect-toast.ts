'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

/** Show a toast when user was redirected due to insufficient privileges */
export function useAccessRedirectToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('reason') === 'no-access') {
      toast.error('Access denied', { description: 'You do not have permission to access that page.' });
      // Clean up URL without triggering navigation
      const url = new URL(window.location.href);
      url.searchParams.delete('reason');
      router.replace(url.pathname + url.search, { scroll: false });
    }
  }, [searchParams, router]);
}
