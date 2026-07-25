import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/routes';

/**
 * `/marketplace` has no screen of its own — the venue is only ever entered from
 * one side. Without this it 404s, since both real surfaces live one level down.
 * Routing to the borrower portal lets the edge guard bounce a lender to their
 * desk, keeping the role decision in `proxy.ts` alone.
 */
export default function MarketplaceIndexPage() {
  redirect(ROUTES.borrower.offers);
}
