'use client';

import { useAccessRedirectToast } from './use-access-redirect-toast';

/** Client component wrapper to use the redirect toast hook in Server Component layouts */
export function AccessRedirectToastListener() {
  useAccessRedirectToast();
  return null;
}
