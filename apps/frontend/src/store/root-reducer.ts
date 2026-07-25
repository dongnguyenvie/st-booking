import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './modules/auth/auth-slice';
import { permissionsReducer } from './modules/admin/permissions/permissions-slice';
import { usersReducer } from './modules/admin/users/users-slice';
import { apiKeysReducer } from './modules/admin/api-keys/api-keys-slice';
import { adminSettingsReducer } from './modules/admin/settings/settings-slice';
import { securityReducer } from './modules/settings/security/security-slice';
import { workspaceReducer } from './modules/marketplace/borrower/workspace/workspace-slice';
import { offersReducer } from './modules/marketplace/borrower/offers/offers-slice';
import { marketReducer } from './modules/marketplace/borrower/market/market-slice';
import { offerDetailReducer } from './modules/marketplace/borrower/offer-detail/offer-detail-slice';
import { fundingRoomReducer } from './modules/marketplace/borrower/funding-room/funding-room-slice';
import { fundingsReducer } from './modules/marketplace/borrower/fundings/fundings-slice';
import { profileReducer } from './modules/marketplace/borrower/profile/profile-slice';
import { dealsReducer } from './modules/marketplace/lender/deals/deals-slice';
import { dealDetailReducer } from './modules/marketplace/lender/deal-detail/deal-detail-slice';
import { lenderWorkspaceReducer } from './modules/marketplace/lender/workspace/workspace-slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  // Persist session fields only — exclude transient UI state
  whitelist: ['token', 'user', 'isAuthenticated', 'activePrivilege'],
};

export const rootReducer = combineReducers({
  // Global — shared across pages
  auth: persistReducer(authPersistConfig, authReducer),

  // Admin — one slice per page
  permissions: permissionsReducer,
  adminUsers: usersReducer,
  adminApiKeys: apiKeysReducer,
  adminSettings: adminSettingsReducer,

  // Settings
  settingsSecurity: securityReducer,

  // Marketplace — one slice per page. Both sides read the same domain model
  // (src/mock/marketplace); only the lens differs.
  //
  // Borrower portal
  borrowerWorkspace: workspaceReducer,
  borrowerOffers: offersReducer,
  borrowerMarket: marketReducer,
  borrowerOfferDetail: offerDetailReducer,
  borrowerFundingRoom: fundingRoomReducer,
  borrowerFundings: fundingsReducer,
  borrowerProfile: profileReducer,

  // Lender desk
  lenderWorkspace: lenderWorkspaceReducer,
  lenderDeals: dealsReducer,
  lenderDealDetail: dealDetailReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
