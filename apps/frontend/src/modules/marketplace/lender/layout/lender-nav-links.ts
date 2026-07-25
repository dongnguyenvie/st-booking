import type { LucideIcon } from 'lucide-react';
import { LayoutList } from 'lucide-react';

export interface LenderNavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Lender desk surfaces.
 *
 * The prototype's sidebar also carries Today / Marketplace / Funded / Settings.
 * Only Deals is built, so only Deals is listed — a nav entry pointing at a
 * route that does not exist is worse than an absent one.
 */
export const LENDER_NAV_LINKS: LenderNavLink[] = [
  { href: '/marketplace/lender/deals', label: 'Deals', icon: LayoutList },
];
