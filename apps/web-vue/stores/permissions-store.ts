import { defineStore } from 'pinia';

export interface PolicyItem {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  scopes: string[];
  businessId: string | null;
  createdAt: string;
}

export interface AvailableScopes {
  graphql: string[];
  rest: string[];
  permissions: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface PermissionsState {
  policies: PolicyItem[];
  meta: PaginationMeta | null;
  availableScopes: AvailableScopes | null;
  loading: boolean;
  error: string | null;
  createDialogOpen: boolean;
  editingPolicy: PolicyItem | null;
}

export const usePermissionsStore = defineStore('permissions', {
  state: (): PermissionsState => ({
    policies: [],
    meta: null,
    availableScopes: null,
    loading: false,
    error: null,
    createDialogOpen: false,
    editingPolicy: null,
  }),

  actions: {
    setPolicies(policies: PolicyItem[], meta: PaginationMeta | null = null) {
      this.policies = policies;
      this.meta = meta;
    },

    setAvailableScopes(scopes: AvailableScopes | null) {
      this.availableScopes = scopes;
    },

    upsertPolicy(policy: PolicyItem) {
      const idx = this.policies.findIndex((p) => p.id === policy.id);
      if (idx !== -1) {
        this.policies[idx] = policy;
      } else {
        this.policies.push(policy);
      }
    },

    setLoading(value: boolean) {
      this.loading = value;
    },

    setError(message: string | null) {
      this.error = message;
    },

    openCreateDialog() {
      this.createDialogOpen = true;
      this.editingPolicy = null;
    },

    openEditDialog(policy: PolicyItem) {
      this.createDialogOpen = true;
      this.editingPolicy = policy;
    },

    closeDialog() {
      this.createDialogOpen = false;
      this.editingPolicy = null;
    },

    reset() {
      this.policies = [];
      this.meta = null;
      this.availableScopes = null;
      this.loading = false;
      this.error = null;
      this.createDialogOpen = false;
      this.editingPolicy = null;
    },
  },
});
