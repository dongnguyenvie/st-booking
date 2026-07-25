import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDefaultPrivilege } from '@repo/core';
import type { AuthState, AuthUser, TwoFactorChallenge } from './auth-types';

export const initialState: AuthState = {
  loadingCount: 0,
  token: null,
  user: null,
  isAuthenticated: false,
  errorAfterSubmit: null,
  activePrivilege: null,
  // Ephemeral — not in redux-persist whitelist so never survives reload
  twoFactorChallenge: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    pushLoading(state) {
      state.loadingCount++;
    },
    popLoading(state) {
      if (state.loadingCount > 0) state.loadingCount--;
    },
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.errorAfterSubmit = null;
      // Preserve activePrivilege if still valid, otherwise derive from privileges
      if (state.activePrivilege === null || !user.privileges.includes(state.activePrivilege)) {
        state.activePrivilege = getDefaultPrivilege(user.privileges);
      }
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.activePrivilege = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.errorAfterSubmit = action.payload;
    },
    setActivePrivilege(state, action: PayloadAction<number>) {
      state.activePrivilege = action.payload;
    },
    /** Merge partial user fields — used to sync 2FA status after setup/disable */
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    /** Set ephemeral pre-auth challenge (signIn returned twoFactorRequired=true) */
    setTwoFactorChallenge(state, action: PayloadAction<TwoFactorChallenge>) {
      state.twoFactorChallenge = action.payload;
    },
    /** Clear ephemeral challenge after successful verify or on logout */
    clearTwoFactorChallenge(state) {
      state.twoFactorChallenge = null;
    },
  },
});

export const authSliceActions = authSlice.actions;
export const authReducer = authSlice.reducer;
