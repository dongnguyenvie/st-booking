import { defineStore } from 'pinia';
import { Privilege, getDefaultPrivilege } from '@repo/core';
import type { TwoFactorMethod } from '~/api-service/generated/graphql';
import {
  PRIVILEGE_GROUPS,
  getRouteByPrivilege,
  getHomeRouteByPrivileges,
} from '~/config/get-home-route-by-privileges';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  privileges: number[];
}

interface TwoFactorChallenge {
  preAuthToken: string;
  method: TwoFactorMethod;
  email: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  activePrivilege: number | null;
  // Ephemeral 2FA pre-auth challenge — not persisted, does not survive reload
  twoFactorChallenge: TwoFactorChallenge | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    activePrivilege: null,
    twoFactorChallenge: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,

    privileges: (state) => state.user?.privileges ?? [],

    hasPrivilege: (state) => (privilege: number) => {
      return state.user?.privileges?.includes(privilege) ?? false;
    },

    isAdmin: (state): boolean => {
      const p = state.user?.privileges ?? [];
      return p.includes(Privilege.SUPER_ADMIN);
    },

    /** Dashboard route for the currently active privilege */
    activeDashboardRoute: (state): string => {
      if (state.activePrivilege !== null) return getRouteByPrivilege(state.activePrivilege);
      return getHomeRouteByPrivileges(state.user?.privileges ?? []);
    },

    /** Privilege groups the user has access to — used for dashboard switcher UI */
    availablePrivilegeGroups: (state) => {
      const userPrivileges = state.user?.privileges ?? [];
      return PRIVILEGE_GROUPS.filter((group) => group.privileges.some((p) => userPrivileges.includes(p)));
    },
  },

  actions: {
    setAuth(token: string, user: AuthUser) {
      this.token = token;
      this.user = user;
      // Preserve activePrivilege if still valid, otherwise derive from user's privileges
      if (this.activePrivilege === null || !user.privileges.includes(this.activePrivilege)) {
        this.activePrivilege = getDefaultPrivilege(user.privileges);
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      this.activePrivilege = null;
      this.twoFactorChallenge = null;
    },

    /** Switch active dashboard; guards against privileges the user doesn't have */
    setActivePrivilege(privilege: number) {
      if (!this.user?.privileges.includes(privilege)) return;
      this.activePrivilege = privilege;
    },

    /** Set ephemeral pre-auth challenge (signIn returned twoFactorRequired=true) */
    setTwoFactorChallenge(challenge: TwoFactorChallenge) {
      this.twoFactorChallenge = challenge;
    },

    clearTwoFactorChallenge() {
      this.twoFactorChallenge = null;
    },

    /** Merge partial user fields — used to sync 2FA status after setup/disable */
    updateUser(partial: Partial<AuthUser>) {
      if (this.user) {
        this.user = { ...this.user, ...partial };
      }
    },
  },

  // pinia-plugin-persistedstate v3: persist session fields to localStorage
  persist: {
    paths: ['token', 'user', 'activePrivilege'],
  },
});
