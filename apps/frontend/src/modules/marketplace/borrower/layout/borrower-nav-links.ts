import type { LucideIcon } from 'lucide-react';
import { Inbox, LineChart, Landmark, UserRound } from 'lucide-react';

export interface BorrowerNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The borrower portal's four top-level surfaces. Kept as data so the top nav and
 * any future mobile tab bar stay in step without duplicating the list.
 */
export const BORROWER_NAV_LINKS: BorrowerNavLink[] = [
  { href: '/marketplace/borrower/offers', label: 'Offers', icon: Inbox },
  { href: '/marketplace/borrower/market', label: 'Market', icon: LineChart },
  { href: '/marketplace/borrower/fundings', label: 'Past fundings', icon: Landmark },
  { href: '/marketplace/borrower/profile', label: 'Your profile', icon: UserRound },
];
