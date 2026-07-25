import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store/root-reducer';
import { findLender } from '@/mock/marketplace';
import { priceOffer } from '@/core/marketplace/price-offer';
import { initialState } from './offer-detail-slice';

const selectDomain = (state: RootState) => state.borrowerOfferDetail ?? initialState;

const selectOffer = createSelector([selectDomain], (s) => s.offer);
const selectAmount = createSelector([selectDomain], (s) => s.amount);
const selectTerm = createSelector([selectDomain], (s) => s.term);
const selectFrequency = createSelector([selectDomain], (s) => s.frequency);
const selectSharpened = createSelector([selectDomain], (s) => s.sharpened);
const selectSignOpen = createSelector([selectDomain], (s) => s.signOpen);
const selectLoading = createSelector([selectDomain], (s) => s.loading);
const selectError = createSelector([selectDomain], (s) => s.error);

const selectLender = createSelector([selectOffer], (offer) =>
  offer ? (findLender(offer.lenderId) ?? null) : null,
);

/**
 * The offer as currently shaped. Derived, never stored — keeping the priced
 * result in state would let it drift out of step with the controls.
 */
const selectPriced = createSelector(
  [selectOffer, selectAmount, selectTerm, selectFrequency, selectSharpened],
  (offer, amount, term, frequency, sharpened) =>
    offer ? priceOffer(offer, { amount, term, frequency, sharpened }) : null,
);

/** Total cost of credit at the current shape — the number the borrower feels. */
const selectTotalInterest = createSelector([selectPriced, selectAmount], (priced, amount) =>
  priced ? Math.max(0, priced.payment * priced.installments - amount) : null,
);

export const offerDetailSelectors = {
  selectDomain,
  selectOffer,
  selectLender,
  selectPriced,
  selectTotalInterest,
  selectAmount,
  selectTerm,
  selectFrequency,
  selectSharpened,
  selectSignOpen,
  selectLoading,
  selectError,
};
