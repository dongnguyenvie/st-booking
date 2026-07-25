import type { ReactNode } from 'react';
import { LenderDeskNav } from '@/modules/marketplace/lender/layout/lender-desk-nav';

/**
 * Lender desk chrome — a persistent sidebar, per `lender.html`.
 * A desk triages a queue all day, so the nav stays on screen with live counts.
 */
export default function LenderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <LenderDeskNav />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
