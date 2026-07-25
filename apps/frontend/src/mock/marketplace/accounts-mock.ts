import type { Account, AccountId } from './marketplace-types';

/**
 * The two worlds a single person holds (BUSINESS-LOGIC §2). Every offer / LOI /
 * funding record is scoped to one of these — switching accounts switches the
 * whole workspace, it is not a display filter.
 */
export const MOCK_ACCOUNTS: Record<AccountId, Account> = {
  business: {
    id: 'business',
    name: 'Northwind Bicycle Co.',
    kind: 'Business',
    who: 'Avery Singh',
    mark: 'meridian',
    region: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    worth: 560000,
    bestRate: 7.84,
    lenders: 8,
    revenueLabel: 'Monthly revenue',
    revenueValue: '$184,000',
    revenueTrend: [128, 132, 141, 138, 150, 162, 158, 170, 176, 174, 181, 184],
    revenueSources: ['Royal Bank', 'Stripe', 'QuickBooks'],
    revenueStats: [
      ['This month', '$184K'],
      ['Trailing 12mo', '$1.94M'],
      ['Avg. balance', '$48.2K'],
      ['Net margin', '25%'],
    ],
    request: {
      product: 'Equipment financing',
      amount: 67000,
      currency: 'CAD',
      purpose: 'New CNC + assembly line',
      appliedOn: 'Jun 3, 2026',
      daysAgo: 5,
      validDays: 30,
    },
    eligible: [
      { id: 'loc', name: 'Working-capital line', max: 120000, range: 'up to $120K', rate: 'from 8.9%', blurb: 'Draw as needed', lenders: 6 },
      { id: 'term', name: 'Term loan', max: 250000, range: 'up to $250K', rate: 'from 9.4%', blurb: 'Fixed monthly', lenders: 9 },
      { id: 'inv', name: 'Invoice financing', max: 84000, range: 'up to $84K', rate: 'from 1.9%/mo', blurb: 'Against receivables', lenders: 4 },
      { id: 'card', name: 'Corporate card', max: 40000, range: '$40K limit', rate: '1.5% back', blurb: 'Spend + rewards', lenders: 3 },
    ],
  },
  personal: {
    id: 'personal',
    name: 'Avery Singh',
    kind: 'Personal',
    who: 'Personal account',
    mark: 'foundry',
    region: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    worth: 95000,
    bestRate: 8.6,
    lenders: 11,
    revenueLabel: 'Annual income',
    revenueValue: '$148,000',
    revenueTrend: [11.2, 11.4, 11.8, 12.0, 12.1, 12.0, 12.3, 12.4, 12.2, 12.5, 12.6, 12.8],
    revenueSources: ['Royal Bank', 'Payroll'],
    revenueStats: [
      ['Monthly income', '$12.3K'],
      ['Trailing 12mo', '$148K'],
      ['Avg. balance', '$22.4K'],
      ['Savings rate', '18%'],
    ],
    request: {
      product: 'Personal line of credit',
      amount: 25000,
      currency: 'CAD',
      purpose: 'Home studio build-out',
      appliedOn: 'Jun 6, 2026',
      daysAgo: 2,
      validDays: 30,
    },
    eligible: [
      { id: 'ploan', name: 'Personal loan', max: 50000, range: 'up to $50K', rate: 'from 8.6%', blurb: 'Fixed term', lenders: 7 },
      { id: 'auto', name: 'Auto financing', max: 60000, range: 'up to $60K', rate: 'from 6.9%', blurb: 'New or used', lenders: 5 },
      { id: 'card', name: 'Rewards card', max: 25000, range: '$25K limit', rate: '2% back', blurb: 'Everyday spend', lenders: 4 },
      { id: 'heloc', name: 'Home equity line', max: 180000, range: 'up to $180K', rate: 'from 6.2%', blurb: 'Against your home', lenders: 3 },
    ],
  },
};

export const MOCK_ACCOUNT_LIST: Account[] = [MOCK_ACCOUNTS.business, MOCK_ACCOUNTS.personal];
