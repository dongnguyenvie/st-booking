import type { Stip } from './marketplace-types';

/**
 * The lender's funding conditions, requested AFTER the LOI is signed — never
 * before (BUSINESS-LOGIC §6). Every stip approved ⇒ funded.
 *
 * `verify` stips are auto-satisfied from the unified profile; `req` stips need
 * the borrower to upload, answer or sign something.
 */
export const MOCK_STIPS: Stip[] = [
  {
    id: 'identity',
    group: 'verify',
    title: 'Identity',
    subtitle: 'Government ID + selfie · reused from your profile',
    state: 'approved',
    approvedOn: 'Jun 9',
    approvedBy: 'Auto from your profile',
    history: [
      { at: 'Jun 9, 9:14am', who: 'Carousel', what: 'Stip auto-satisfied from your unified profile' },
      { at: 'Jun 9, 9:14am', who: 'Lender', what: 'Approved' },
    ],
  },
  {
    id: 'bizbank',
    group: 'verify',
    title: 'Business bank account',
    subtitle: 'Royal Bank · read-only · refreshed today',
    state: 'approved',
    approvedOn: 'Jun 9',
    approvedBy: 'Auto from your profile',
    history: [
      { at: 'Jun 9, 9:14am', who: 'Carousel', what: 'Stip auto-satisfied from your unified profile' },
      { at: 'Jun 9, 9:14am', who: 'Lender', what: 'Approved' },
    ],
  },
  {
    id: 'bizreg',
    group: 'verify',
    title: 'Business registration',
    subtitle: 'Yours is 1.0y old — the lender wants it refreshed within a year',
    state: 'todo',
    cta: 'Refresh',
    history: [{ at: 'Jun 9, 9:14am', who: 'Lender', what: 'Requested — refresh required within 365 days' }],
  },
  {
    id: 'usefunds',
    group: 'req',
    title: 'Intended use of funds',
    subtitle: 'A short answer the lender will attach to the contract',
    state: 'todo',
    cta: 'Answer',
    history: [{ at: 'Jun 9, 9:14am', who: 'Lender', what: 'Requested' }],
  },
  {
    id: 'ytd',
    group: 'req',
    title: 'YTD profit & loss',
    subtitle: 'Signed by your accountant, current to last month',
    state: 'todo',
    cta: 'Upload',
    history: [{ at: 'Jun 9, 9:14am', who: 'Lender', what: 'Requested' }],
  },
  {
    id: 'coi',
    group: 'req',
    title: 'Certificate of insurance',
    subtitle: 'Naming the lender as additional insured',
    state: 'todo',
    cta: 'Upload',
    history: [{ at: 'Jun 9, 9:14am', who: 'Lender', what: 'Requested' }],
  },
  {
    id: 'pg',
    group: 'req',
    title: 'Personal guarantee acknowledgement',
    subtitle: 'E-signature · takes ~30 seconds',
    state: 'todo',
    cta: 'Sign',
    history: [{ at: 'Jun 9, 9:14am', who: 'Lender', what: 'Requested' }],
  },
];
