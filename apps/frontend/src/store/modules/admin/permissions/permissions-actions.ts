import { getDispatch } from '@/store/store-core';
import { permissionsSliceActions as A } from './permissions-slice';
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useSetRolePermissionsMutation,
  useSetDefaultRoleMutation,
  useDeleteRoleMutation,
} from '@/api-service/generated/graphql-hooks.generated';
import type { CreateRoleInput, UpdateRoleInput } from '@/api-service/generated/graphql.generated';

type Callbacks = { onSuccess?: () => void; onError?: (msg: string) => void };

const errMsg = (err: any, fallback: string) =>
  err?.response?.errors?.[0]?.message ?? err?.message ?? fallback;

// ==========================================================================================
// Thunk actions — call via dispatch(permissionsA.fetchRoles())
// ==========================================================================================

/** Fetch all roles (with their permission sets) and populate the store. */
const fetchRoles = () => async () => {
  const dispatch = getDispatch();
  dispatch(A.pushLoading());
  dispatch(A.setError(null));
  try {
    const data = await useGetRolesQuery.fetcher()();
    dispatch(A.setRoles(data.getRoles.data));
  } catch (err: any) {
    dispatch(A.setError(errMsg(err, 'Failed to load roles')));
  } finally {
    dispatch(A.popLoading());
  }
};

/** Fetch the permission catalog (matrix rows). limit is capped at 100 by PaginationInput. */
const fetchPermissionCatalog = () => async () => {
  const dispatch = getDispatch();
  try {
    const data = await useGetPermissionsQuery.fetcher({ pagination: { page: 1, limit: 100 } })();
    dispatch(A.setPermissionCatalog(data.getPermissions.data));
  } catch (err: any) {
    // Surface it — a silent failure here renders an empty matrix with no clue why.
    dispatch(A.setError(errMsg(err, 'Failed to load the permission catalog')));
  }
};

/** Create a new role (with its permissions), then refresh the list. */
const createRole =
  (input: CreateRoleInput, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    try {
      await useCreateRoleMutation.fetcher({ input })();
      const data = await useGetRolesQuery.fetcher()();
      dispatch(A.setRoles(data.getRoles.data));
      callbacks.onSuccess?.();
    } catch (err: any) {
      callbacks.onError?.(errMsg(err, 'Failed to create role'));
    } finally {
      dispatch(A.popLoading());
    }
  };

/** Update a role's name/description, then refresh the list. */
const updateRole =
  (id: string, input: UpdateRoleInput, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    try {
      await useUpdateRoleMutation.fetcher({ id, input })();
      const data = await useGetRolesQuery.fetcher()();
      dispatch(A.setRoles(data.getRoles.data));
      callbacks.onSuccess?.();
    } catch (err: any) {
      callbacks.onError?.(errMsg(err, 'Failed to update role'));
    } finally {
      dispatch(A.popLoading());
    }
  };

/** Replace a role's permission set (matrix cell toggles), then refresh. */
const setRolePermissions =
  (roleId: string, permissionKeys: string[], callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    try {
      await useSetRolePermissionsMutation.fetcher({ input: { roleId, permissionKeys } })();
      const data = await useGetRolesQuery.fetcher()();
      dispatch(A.setRoles(data.getRoles.data));
      callbacks.onSuccess?.();
    } catch (err: any) {
      dispatch(A.setError(errMsg(err, 'Failed to update permissions')));
      callbacks.onError?.(errMsg(err, 'Failed to update permissions'));
    }
  };

/** Make a role the one new self-signups receive, then refresh. */
const setDefaultRole =
  (roleId: string, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    try {
      await useSetDefaultRoleMutation.fetcher({ id: roleId })();
      const data = await useGetRolesQuery.fetcher()();
      dispatch(A.setRoles(data.getRoles.data));
      callbacks.onSuccess?.();
    } catch (err: any) {
      dispatch(A.setError(errMsg(err, 'Failed to set the default signup role')));
      callbacks.onError?.(errMsg(err, 'Failed to set the default signup role'));
    }
  };

/** Delete (soft) a role, then refresh the list. */
const deleteRole =
  (id: string, callbacks: Callbacks = {}) =>
  async () => {
    const dispatch = getDispatch();
    dispatch(A.pushLoading());
    try {
      await useDeleteRoleMutation.fetcher({ id })();
      const data = await useGetRolesQuery.fetcher()();
      dispatch(A.setRoles(data.getRoles.data));
      callbacks.onSuccess?.();
    } catch (err: any) {
      callbacks.onError?.(errMsg(err, 'Failed to delete role'));
    } finally {
      dispatch(A.popLoading());
    }
  };

// ==========================================================================================

/** Initialize the roles page — fetch roles + the permission catalog on mount. */
const init = () => async () => {
  const dispatch = getDispatch();
  dispatch(fetchRoles());
  dispatch(fetchPermissionCatalog());
};

/** Destroy the roles page — reset store state on unmount. */
const destroy = () => () => {
  const dispatch = getDispatch();
  dispatch(A.reset());
};

// ==========================================================================================

export const permissionsExtendActions = {
  init,
  destroy,
  fetchRoles,
  fetchPermissionCatalog,
  createRole,
  updateRole,
  setRolePermissions,
  setDefaultRole,
  deleteRole,
};
