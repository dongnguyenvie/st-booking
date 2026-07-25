import { offerDetailSliceActions } from './offer-detail-slice';
import { offerDetailExtendActions } from './offer-detail-actions';
import { offerDetailSelectors } from './offer-detail-selectors';

/** Offer detail actions: slice reducers + thunk actions */
export const offerDetailA = {
  ...offerDetailSliceActions,
  ...offerDetailExtendActions,
};

/** Offer detail selectors */
export const offerDetailS = offerDetailSelectors;

export * from './offer-detail-slice';
export * as OfferDetailTypes from './offer-detail-types';
