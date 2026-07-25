/**
 * Static mock data for the marketplace sample.
 *
 * Everything the marketplace renders comes from here — there are no network
 * calls anywhere in the feature. Swapping to a real API means replacing the
 * bodies of these modules (or the thunks in the store modules that read them);
 * the types and every consumer downstream stay as they are.
 */
// Shared domain — one model, read by both sides of the venue.
export * from './marketplace-types';
export * from './accounts-mock';
export * from './lenders-mock';
export * from './offers-mock';
export * from './stips-mock';
export * from './fundings-mock';

// The lender's lens onto those same deals.
export * from './lender-types';
export * from './lender-mock';
