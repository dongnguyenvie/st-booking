import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/routes';

/**
 * Root is the marketplace — that is the product; admin is back office.
 *
 * This lands everyone on the borrower portal rather than sniffing privileges
 * here. A visitor who cannot use it is re-routed by the edge guard in
 * `proxy.ts`: a lender goes to their desk, an admin-only account to the admin
 * dashboard, a signed-out visitor to login. Keeping that decision in one place
 * avoids two redirect policies that can disagree.
 */
export default function RootPage() {
  redirect(ROUTES.borrower.offers);
}
