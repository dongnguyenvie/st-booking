import * as Types from './graphql.generated';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { fetcher } from '@/api-service/graphql-client';
class TypedDocumentString<TResult, TVariables> extends String {}
export * from './graphql.generated';

export const GetMyApiKeysDocument = new TypedDocumentString(`
    query GetMyApiKeys($pagination: PaginationInput) {
  getMyApiKeys(pagination: $pagination) {
    data {
      id
      name
      roleIds
      userId
      createdAt
      updatedAt
    }
    meta {
      total
      page
      limit
    }
  }
}
    `);

export const useGetMyApiKeysQuery = <TData = Types.GetMyApiKeysQuery, TError = unknown>(
  variables?: Types.GetMyApiKeysQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetMyApiKeysQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetMyApiKeysQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetMyApiKeysQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetMyApiKeys'] : ['GetMyApiKeys', variables],
    queryFn: fetcher<Types.GetMyApiKeysQuery, Types.GetMyApiKeysQueryVariables>(
      GetMyApiKeysDocument,
      variables,
    ),
    ...options,
  });
};

useGetMyApiKeysQuery.getKey = (variables?: Types.GetMyApiKeysQueryVariables) =>
  variables === undefined ? ['GetMyApiKeys'] : ['GetMyApiKeys', variables];

useGetMyApiKeysQuery.fetcher = (
  variables?: Types.GetMyApiKeysQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.GetMyApiKeysQuery, Types.GetMyApiKeysQueryVariables>(
    GetMyApiKeysDocument,
    variables,
    options,
  );

export const CreateApiKeyDocument = new TypedDocumentString(`
    mutation CreateApiKey($input: CreateApiKeyInput!) {
  createApiKey(input: $input) {
    data {
      id
      name
      key
      roleIds
      userId
      createdAt
      updatedAt
    }
  }
}
    `);

export const useCreateApiKeyMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.CreateApiKeyMutation,
    TError,
    Types.CreateApiKeyMutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.CreateApiKeyMutation, TError, Types.CreateApiKeyMutationVariables, TContext>({
    mutationKey: ['CreateApiKey'],
    mutationFn: (variables?: Types.CreateApiKeyMutationVariables) =>
      fetcher<Types.CreateApiKeyMutation, Types.CreateApiKeyMutationVariables>(
        CreateApiKeyDocument,
        variables,
      )(),
    ...options,
  });
};

useCreateApiKeyMutation.fetcher = (
  variables: Types.CreateApiKeyMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.CreateApiKeyMutation, Types.CreateApiKeyMutationVariables>(
    CreateApiKeyDocument,
    variables,
    options,
  );

export const DeleteApiKeyDocument = new TypedDocumentString(`
    mutation DeleteApiKey($id: String!) {
  deleteApiKey(id: $id) {
    data {
      id
    }
  }
}
    `);

export const useDeleteApiKeyMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.DeleteApiKeyMutation,
    TError,
    Types.DeleteApiKeyMutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.DeleteApiKeyMutation, TError, Types.DeleteApiKeyMutationVariables, TContext>({
    mutationKey: ['DeleteApiKey'],
    mutationFn: (variables?: Types.DeleteApiKeyMutationVariables) =>
      fetcher<Types.DeleteApiKeyMutation, Types.DeleteApiKeyMutationVariables>(
        DeleteApiKeyDocument,
        variables,
      )(),
    ...options,
  });
};

useDeleteApiKeyMutation.fetcher = (
  variables: Types.DeleteApiKeyMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.DeleteApiKeyMutation, Types.DeleteApiKeyMutationVariables>(
    DeleteApiKeyDocument,
    variables,
    options,
  );

export const SignInDocument = new TypedDocumentString(`
    mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    data {
      accessToken
      twoFactorRequired
      preAuthToken
      twoFactorMethod
      user {
        id
        email
        name
        privileges
      }
    }
  }
}
    `);

export const useSignInMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<Types.SignInMutation, TError, Types.SignInMutationVariables, TContext>,
) => {
  return useMutation<Types.SignInMutation, TError, Types.SignInMutationVariables, TContext>({
    mutationKey: ['SignIn'],
    mutationFn: (variables?: Types.SignInMutationVariables) =>
      fetcher<Types.SignInMutation, Types.SignInMutationVariables>(SignInDocument, variables)(),
    ...options,
  });
};

useSignInMutation.fetcher = (variables: Types.SignInMutationVariables, options?: RequestInit['headers']) =>
  fetcher<Types.SignInMutation, Types.SignInMutationVariables>(SignInDocument, variables, options);

export const VerifyTwoFactorDocument = new TypedDocumentString(`
    mutation VerifyTwoFactor($input: VerifyTwoFactorInput!) {
  verifyTwoFactor(input: $input) {
    data {
      accessToken
      user {
        id
        email
        name
        privileges
      }
    }
  }
}
    `);

export const useVerifyTwoFactorMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.VerifyTwoFactorMutation,
    TError,
    Types.VerifyTwoFactorMutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.VerifyTwoFactorMutation, TError, Types.VerifyTwoFactorMutationVariables, TContext>(
    {
      mutationKey: ['VerifyTwoFactor'],
      mutationFn: (variables?: Types.VerifyTwoFactorMutationVariables) =>
        fetcher<Types.VerifyTwoFactorMutation, Types.VerifyTwoFactorMutationVariables>(
          VerifyTwoFactorDocument,
          variables,
        )(),
      ...options,
    },
  );
};

useVerifyTwoFactorMutation.fetcher = (
  variables: Types.VerifyTwoFactorMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.VerifyTwoFactorMutation, Types.VerifyTwoFactorMutationVariables>(
    VerifyTwoFactorDocument,
    variables,
    options,
  );

export const MyAccessDocument = new TypedDocumentString(`
    query MyAccess {
  myAccess {
    data {
      roles
      permissions
    }
  }
}
    `);

export const useMyAccessQuery = <TData = Types.MyAccessQuery, TError = unknown>(
  variables?: Types.MyAccessQueryVariables,
  options?: Omit<UseQueryOptions<Types.MyAccessQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.MyAccessQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.MyAccessQuery, TError, TData>({
    queryKey: variables === undefined ? ['MyAccess'] : ['MyAccess', variables],
    queryFn: fetcher<Types.MyAccessQuery, Types.MyAccessQueryVariables>(MyAccessDocument, variables),
    ...options,
  });
};

useMyAccessQuery.getKey = (variables?: Types.MyAccessQueryVariables) =>
  variables === undefined ? ['MyAccess'] : ['MyAccess', variables];

useMyAccessQuery.fetcher = (variables?: Types.MyAccessQueryVariables, options?: RequestInit['headers']) =>
  fetcher<Types.MyAccessQuery, Types.MyAccessQueryVariables>(MyAccessDocument, variables, options);

export const ResendTwoFactorEmailDocument = new TypedDocumentString(`
    mutation ResendTwoFactorEmail($input: ResendTwoFactorEmailInput!) {
  resendTwoFactorEmail(input: $input) {
    sent
  }
}
    `);

export const useResendTwoFactorEmailMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.ResendTwoFactorEmailMutation,
    TError,
    Types.ResendTwoFactorEmailMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.ResendTwoFactorEmailMutation,
    TError,
    Types.ResendTwoFactorEmailMutationVariables,
    TContext
  >({
    mutationKey: ['ResendTwoFactorEmail'],
    mutationFn: (variables?: Types.ResendTwoFactorEmailMutationVariables) =>
      fetcher<Types.ResendTwoFactorEmailMutation, Types.ResendTwoFactorEmailMutationVariables>(
        ResendTwoFactorEmailDocument,
        variables,
      )(),
    ...options,
  });
};

useResendTwoFactorEmailMutation.fetcher = (
  variables: Types.ResendTwoFactorEmailMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.ResendTwoFactorEmailMutation, Types.ResendTwoFactorEmailMutationVariables>(
    ResendTwoFactorEmailDocument,
    variables,
    options,
  );

export const SignInByAuth0Document = new TypedDocumentString(`
    mutation SignInByAuth0($input: SignInByAuth0Input!) {
  signInByAuth0(input: $input) {
    data {
      accessToken
      user {
        id
        email
        name
        privileges
      }
    }
  }
}
    `);

export const useSignInByAuth0Mutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.SignInByAuth0Mutation,
    TError,
    Types.SignInByAuth0MutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.SignInByAuth0Mutation, TError, Types.SignInByAuth0MutationVariables, TContext>({
    mutationKey: ['SignInByAuth0'],
    mutationFn: (variables?: Types.SignInByAuth0MutationVariables) =>
      fetcher<Types.SignInByAuth0Mutation, Types.SignInByAuth0MutationVariables>(
        SignInByAuth0Document,
        variables,
      )(),
    ...options,
  });
};

useSignInByAuth0Mutation.fetcher = (
  variables: Types.SignInByAuth0MutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.SignInByAuth0Mutation, Types.SignInByAuth0MutationVariables>(
    SignInByAuth0Document,
    variables,
    options,
  );

export const RegisterUserDocument = new TypedDocumentString(`
    mutation RegisterUser($input: RegisterUserInput!) {
  registerUser(input: $input) {
    data {
      accessToken
      user {
        id
        email
        name
        privileges
      }
    }
  }
}
    `);

export const useRegisterUserMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.RegisterUserMutation,
    TError,
    Types.RegisterUserMutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.RegisterUserMutation, TError, Types.RegisterUserMutationVariables, TContext>({
    mutationKey: ['RegisterUser'],
    mutationFn: (variables?: Types.RegisterUserMutationVariables) =>
      fetcher<Types.RegisterUserMutation, Types.RegisterUserMutationVariables>(
        RegisterUserDocument,
        variables,
      )(),
    ...options,
  });
};

useRegisterUserMutation.fetcher = (
  variables: Types.RegisterUserMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.RegisterUserMutation, Types.RegisterUserMutationVariables>(
    RegisterUserDocument,
    variables,
    options,
  );

export const GetDashboardStatsDocument = new TypedDocumentString(`
    query GetDashboardStats {
  getDashboardStats {
    data {
      totalUsers
      activeUsers
      totalRoles
    }
  }
}
    `);

export const useGetDashboardStatsQuery = <TData = Types.GetDashboardStatsQuery, TError = unknown>(
  variables?: Types.GetDashboardStatsQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetDashboardStatsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetDashboardStatsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetDashboardStatsQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetDashboardStats'] : ['GetDashboardStats', variables],
    queryFn: fetcher<Types.GetDashboardStatsQuery, Types.GetDashboardStatsQueryVariables>(
      GetDashboardStatsDocument,
      variables,
    ),
    ...options,
  });
};

useGetDashboardStatsQuery.getKey = (variables?: Types.GetDashboardStatsQueryVariables) =>
  variables === undefined ? ['GetDashboardStats'] : ['GetDashboardStats', variables];

useGetDashboardStatsQuery.fetcher = (
  variables?: Types.GetDashboardStatsQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.GetDashboardStatsQuery, Types.GetDashboardStatsQueryVariables>(
    GetDashboardStatsDocument,
    variables,
    options,
  );

export const GetRolesDocument = new TypedDocumentString(`
    query GetRoles($pagination: PaginationInput) {
  getRoles(pagination: $pagination) {
    data {
      id
      name
      description
      isDefault
      createdAt
      updatedAt
      rolePermissions {
        permission {
          id
          key
          resource
          action
          description
        }
      }
    }
    meta {
      total
      page
      limit
    }
  }
}
    `);

export const useGetRolesQuery = <TData = Types.GetRolesQuery, TError = unknown>(
  variables?: Types.GetRolesQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetRolesQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetRolesQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetRolesQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetRoles'] : ['GetRoles', variables],
    queryFn: fetcher<Types.GetRolesQuery, Types.GetRolesQueryVariables>(GetRolesDocument, variables),
    ...options,
  });
};

useGetRolesQuery.getKey = (variables?: Types.GetRolesQueryVariables) =>
  variables === undefined ? ['GetRoles'] : ['GetRoles', variables];

useGetRolesQuery.fetcher = (variables?: Types.GetRolesQueryVariables, options?: RequestInit['headers']) =>
  fetcher<Types.GetRolesQuery, Types.GetRolesQueryVariables>(GetRolesDocument, variables, options);

export const GetRoleDocument = new TypedDocumentString(`
    query GetRole($id: String!) {
  getRole(id: $id) {
    data {
      id
      name
      description
      isDefault
      createdAt
      updatedAt
      rolePermissions {
        permission {
          id
          key
          resource
          action
          description
        }
      }
    }
  }
}
    `);

export const useGetRoleQuery = <TData = Types.GetRoleQuery, TError = unknown>(
  variables: Types.GetRoleQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetRoleQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetRoleQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetRoleQuery, TError, TData>({
    queryKey: ['GetRole', variables],
    queryFn: fetcher<Types.GetRoleQuery, Types.GetRoleQueryVariables>(GetRoleDocument, variables),
    ...options,
  });
};

useGetRoleQuery.getKey = (variables: Types.GetRoleQueryVariables) => ['GetRole', variables];

useGetRoleQuery.fetcher = (variables: Types.GetRoleQueryVariables, options?: RequestInit['headers']) =>
  fetcher<Types.GetRoleQuery, Types.GetRoleQueryVariables>(GetRoleDocument, variables, options);

export const GetPermissionsDocument = new TypedDocumentString(`
    query GetPermissions($pagination: PaginationInput) {
  getPermissions(pagination: $pagination) {
    data {
      id
      key
      resource
      action
      description
    }
    meta {
      total
      page
      limit
    }
  }
}
    `);

export const useGetPermissionsQuery = <TData = Types.GetPermissionsQuery, TError = unknown>(
  variables?: Types.GetPermissionsQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetPermissionsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetPermissionsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetPermissionsQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetPermissions'] : ['GetPermissions', variables],
    queryFn: fetcher<Types.GetPermissionsQuery, Types.GetPermissionsQueryVariables>(
      GetPermissionsDocument,
      variables,
    ),
    ...options,
  });
};

useGetPermissionsQuery.getKey = (variables?: Types.GetPermissionsQueryVariables) =>
  variables === undefined ? ['GetPermissions'] : ['GetPermissions', variables];

useGetPermissionsQuery.fetcher = (
  variables?: Types.GetPermissionsQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.GetPermissionsQuery, Types.GetPermissionsQueryVariables>(
    GetPermissionsDocument,
    variables,
    options,
  );

export const GetUserRolesDocument = new TypedDocumentString(`
    query GetUserRoles($userId: String!, $pagination: PaginationInput) {
  getUserRoles(userId: $userId, pagination: $pagination) {
    data {
      id
      name
      description
      rolePermissions {
        permission {
          key
        }
      }
    }
    meta {
      total
      page
      limit
    }
  }
}
    `);

export const useGetUserRolesQuery = <TData = Types.GetUserRolesQuery, TError = unknown>(
  variables: Types.GetUserRolesQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetUserRolesQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetUserRolesQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetUserRolesQuery, TError, TData>({
    queryKey: ['GetUserRoles', variables],
    queryFn: fetcher<Types.GetUserRolesQuery, Types.GetUserRolesQueryVariables>(
      GetUserRolesDocument,
      variables,
    ),
    ...options,
  });
};

useGetUserRolesQuery.getKey = (variables: Types.GetUserRolesQueryVariables) => ['GetUserRoles', variables];

useGetUserRolesQuery.fetcher = (
  variables: Types.GetUserRolesQueryVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.GetUserRolesQuery, Types.GetUserRolesQueryVariables>(
    GetUserRolesDocument,
    variables,
    options,
  );

export const CreateRoleDocument = new TypedDocumentString(`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    data {
      id
      name
      description
      rolePermissions {
        permission {
          key
        }
      }
    }
  }
}
    `);

export const useCreateRoleMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<Types.CreateRoleMutation, TError, Types.CreateRoleMutationVariables, TContext>,
) => {
  return useMutation<Types.CreateRoleMutation, TError, Types.CreateRoleMutationVariables, TContext>({
    mutationKey: ['CreateRole'],
    mutationFn: (variables?: Types.CreateRoleMutationVariables) =>
      fetcher<Types.CreateRoleMutation, Types.CreateRoleMutationVariables>(CreateRoleDocument, variables)(),
    ...options,
  });
};

useCreateRoleMutation.fetcher = (
  variables: Types.CreateRoleMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.CreateRoleMutation, Types.CreateRoleMutationVariables>(
    CreateRoleDocument,
    variables,
    options,
  );

export const UpdateRoleDocument = new TypedDocumentString(`
    mutation UpdateRole($id: String!, $input: UpdateRoleInput!) {
  updateRole(id: $id, input: $input) {
    data {
      id
      name
      description
    }
  }
}
    `);

export const useUpdateRoleMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<Types.UpdateRoleMutation, TError, Types.UpdateRoleMutationVariables, TContext>,
) => {
  return useMutation<Types.UpdateRoleMutation, TError, Types.UpdateRoleMutationVariables, TContext>({
    mutationKey: ['UpdateRole'],
    mutationFn: (variables?: Types.UpdateRoleMutationVariables) =>
      fetcher<Types.UpdateRoleMutation, Types.UpdateRoleMutationVariables>(UpdateRoleDocument, variables)(),
    ...options,
  });
};

useUpdateRoleMutation.fetcher = (
  variables: Types.UpdateRoleMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.UpdateRoleMutation, Types.UpdateRoleMutationVariables>(
    UpdateRoleDocument,
    variables,
    options,
  );

export const DeleteRoleDocument = new TypedDocumentString(`
    mutation DeleteRole($id: String!) {
  deleteRole(id: $id) {
    data {
      id
    }
  }
}
    `);

export const useDeleteRoleMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<Types.DeleteRoleMutation, TError, Types.DeleteRoleMutationVariables, TContext>,
) => {
  return useMutation<Types.DeleteRoleMutation, TError, Types.DeleteRoleMutationVariables, TContext>({
    mutationKey: ['DeleteRole'],
    mutationFn: (variables?: Types.DeleteRoleMutationVariables) =>
      fetcher<Types.DeleteRoleMutation, Types.DeleteRoleMutationVariables>(DeleteRoleDocument, variables)(),
    ...options,
  });
};

useDeleteRoleMutation.fetcher = (
  variables: Types.DeleteRoleMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.DeleteRoleMutation, Types.DeleteRoleMutationVariables>(
    DeleteRoleDocument,
    variables,
    options,
  );

export const SetRolePermissionsDocument = new TypedDocumentString(`
    mutation SetRolePermissions($input: SetRolePermissionsInput!) {
  setRolePermissions(input: $input) {
    data {
      id
      name
      rolePermissions {
        permission {
          key
        }
      }
    }
  }
}
    `);

export const useSetRolePermissionsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.SetRolePermissionsMutation,
    TError,
    Types.SetRolePermissionsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.SetRolePermissionsMutation,
    TError,
    Types.SetRolePermissionsMutationVariables,
    TContext
  >({
    mutationKey: ['SetRolePermissions'],
    mutationFn: (variables?: Types.SetRolePermissionsMutationVariables) =>
      fetcher<Types.SetRolePermissionsMutation, Types.SetRolePermissionsMutationVariables>(
        SetRolePermissionsDocument,
        variables,
      )(),
    ...options,
  });
};

useSetRolePermissionsMutation.fetcher = (
  variables: Types.SetRolePermissionsMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.SetRolePermissionsMutation, Types.SetRolePermissionsMutationVariables>(
    SetRolePermissionsDocument,
    variables,
    options,
  );

export const AssignRoleToUserDocument = new TypedDocumentString(`
    mutation AssignRoleToUser($userId: String!, $roleId: String!) {
  assignRoleToUser(userId: $userId, roleId: $roleId) {
    data {
      id
      name
    }
  }
}
    `);

export const useAssignRoleToUserMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.AssignRoleToUserMutation,
    TError,
    Types.AssignRoleToUserMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.AssignRoleToUserMutation,
    TError,
    Types.AssignRoleToUserMutationVariables,
    TContext
  >({
    mutationKey: ['AssignRoleToUser'],
    mutationFn: (variables?: Types.AssignRoleToUserMutationVariables) =>
      fetcher<Types.AssignRoleToUserMutation, Types.AssignRoleToUserMutationVariables>(
        AssignRoleToUserDocument,
        variables,
      )(),
    ...options,
  });
};

useAssignRoleToUserMutation.fetcher = (
  variables: Types.AssignRoleToUserMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.AssignRoleToUserMutation, Types.AssignRoleToUserMutationVariables>(
    AssignRoleToUserDocument,
    variables,
    options,
  );

export const RemoveRoleFromUserDocument = new TypedDocumentString(`
    mutation RemoveRoleFromUser($userId: String!, $roleId: String!) {
  removeRoleFromUser(userId: $userId, roleId: $roleId) {
    data {
      id
      name
    }
  }
}
    `);

export const useRemoveRoleFromUserMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.RemoveRoleFromUserMutation,
    TError,
    Types.RemoveRoleFromUserMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.RemoveRoleFromUserMutation,
    TError,
    Types.RemoveRoleFromUserMutationVariables,
    TContext
  >({
    mutationKey: ['RemoveRoleFromUser'],
    mutationFn: (variables?: Types.RemoveRoleFromUserMutationVariables) =>
      fetcher<Types.RemoveRoleFromUserMutation, Types.RemoveRoleFromUserMutationVariables>(
        RemoveRoleFromUserDocument,
        variables,
      )(),
    ...options,
  });
};

useRemoveRoleFromUserMutation.fetcher = (
  variables: Types.RemoveRoleFromUserMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.RemoveRoleFromUserMutation, Types.RemoveRoleFromUserMutationVariables>(
    RemoveRoleFromUserDocument,
    variables,
    options,
  );

export const SetDefaultRoleDocument = new TypedDocumentString(`
    mutation SetDefaultRole($id: String!) {
  setDefaultRole(id: $id) {
    data {
      id
      name
      isDefault
    }
  }
}
    `);

export const useSetDefaultRoleMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.SetDefaultRoleMutation,
    TError,
    Types.SetDefaultRoleMutationVariables,
    TContext
  >,
) => {
  return useMutation<Types.SetDefaultRoleMutation, TError, Types.SetDefaultRoleMutationVariables, TContext>({
    mutationKey: ['SetDefaultRole'],
    mutationFn: (variables?: Types.SetDefaultRoleMutationVariables) =>
      fetcher<Types.SetDefaultRoleMutation, Types.SetDefaultRoleMutationVariables>(
        SetDefaultRoleDocument,
        variables,
      )(),
    ...options,
  });
};

useSetDefaultRoleMutation.fetcher = (
  variables: Types.SetDefaultRoleMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.SetDefaultRoleMutation, Types.SetDefaultRoleMutationVariables>(
    SetDefaultRoleDocument,
    variables,
    options,
  );

export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    id
    email
    name
    privileges
    twoFactorEnabled
    twoFactorMethod
  }
}
    `);

export const useMeQuery = <TData = Types.MeQuery, TError = unknown>(
  variables?: Types.MeQueryVariables,
  options?: Omit<UseQueryOptions<Types.MeQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.MeQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.MeQuery, TError, TData>({
    queryKey: variables === undefined ? ['Me'] : ['Me', variables],
    queryFn: fetcher<Types.MeQuery, Types.MeQueryVariables>(MeDocument, variables),
    ...options,
  });
};

useMeQuery.getKey = (variables?: Types.MeQueryVariables) =>
  variables === undefined ? ['Me'] : ['Me', variables];

useMeQuery.fetcher = (variables?: Types.MeQueryVariables, options?: RequestInit['headers']) =>
  fetcher<Types.MeQuery, Types.MeQueryVariables>(MeDocument, variables, options);

export const TwoFactorSetupInitDocument = new TypedDocumentString(`
    mutation TwoFactorSetupInit($method: TwoFactorMethod!) {
  twoFactorSetupInit(method: $method) {
    secret
    qrCodeDataUrl
    challengeId
  }
}
    `);

export const useTwoFactorSetupInitMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.TwoFactorSetupInitMutation,
    TError,
    Types.TwoFactorSetupInitMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.TwoFactorSetupInitMutation,
    TError,
    Types.TwoFactorSetupInitMutationVariables,
    TContext
  >({
    mutationKey: ['TwoFactorSetupInit'],
    mutationFn: (variables?: Types.TwoFactorSetupInitMutationVariables) =>
      fetcher<Types.TwoFactorSetupInitMutation, Types.TwoFactorSetupInitMutationVariables>(
        TwoFactorSetupInitDocument,
        variables,
      )(),
    ...options,
  });
};

useTwoFactorSetupInitMutation.fetcher = (
  variables: Types.TwoFactorSetupInitMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.TwoFactorSetupInitMutation, Types.TwoFactorSetupInitMutationVariables>(
    TwoFactorSetupInitDocument,
    variables,
    options,
  );

export const TwoFactorSetupVerifyDocument = new TypedDocumentString(`
    mutation TwoFactorSetupVerify($input: TwoFactorSetupVerifyInput!) {
  twoFactorSetupVerify(input: $input) {
    success
  }
}
    `);

export const useTwoFactorSetupVerifyMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.TwoFactorSetupVerifyMutation,
    TError,
    Types.TwoFactorSetupVerifyMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.TwoFactorSetupVerifyMutation,
    TError,
    Types.TwoFactorSetupVerifyMutationVariables,
    TContext
  >({
    mutationKey: ['TwoFactorSetupVerify'],
    mutationFn: (variables?: Types.TwoFactorSetupVerifyMutationVariables) =>
      fetcher<Types.TwoFactorSetupVerifyMutation, Types.TwoFactorSetupVerifyMutationVariables>(
        TwoFactorSetupVerifyDocument,
        variables,
      )(),
    ...options,
  });
};

useTwoFactorSetupVerifyMutation.fetcher = (
  variables: Types.TwoFactorSetupVerifyMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.TwoFactorSetupVerifyMutation, Types.TwoFactorSetupVerifyMutationVariables>(
    TwoFactorSetupVerifyDocument,
    variables,
    options,
  );

export const TwoFactorDisableDocument = new TypedDocumentString(`
    mutation TwoFactorDisable($input: TwoFactorDisableInput!) {
  twoFactorDisable(input: $input) {
    success
  }
}
    `);

export const useTwoFactorDisableMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    Types.TwoFactorDisableMutation,
    TError,
    Types.TwoFactorDisableMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    Types.TwoFactorDisableMutation,
    TError,
    Types.TwoFactorDisableMutationVariables,
    TContext
  >({
    mutationKey: ['TwoFactorDisable'],
    mutationFn: (variables?: Types.TwoFactorDisableMutationVariables) =>
      fetcher<Types.TwoFactorDisableMutation, Types.TwoFactorDisableMutationVariables>(
        TwoFactorDisableDocument,
        variables,
      )(),
    ...options,
  });
};

useTwoFactorDisableMutation.fetcher = (
  variables: Types.TwoFactorDisableMutationVariables,
  options?: RequestInit['headers'],
) =>
  fetcher<Types.TwoFactorDisableMutation, Types.TwoFactorDisableMutationVariables>(
    TwoFactorDisableDocument,
    variables,
    options,
  );

export const GetUsersDocument = new TypedDocumentString(`
    query GetUsers($pagination: PaginationInput) {
  getUsers(pagination: $pagination) {
    data {
      id
      email
      name
      isActive
      privileges
      createdAt
    }
    meta {
      total
      page
      limit
    }
  }
}
    `);

export const useGetUsersQuery = <TData = Types.GetUsersQuery, TError = unknown>(
  variables?: Types.GetUsersQueryVariables,
  options?: Omit<UseQueryOptions<Types.GetUsersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<Types.GetUsersQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<Types.GetUsersQuery, TError, TData>({
    queryKey: variables === undefined ? ['GetUsers'] : ['GetUsers', variables],
    queryFn: fetcher<Types.GetUsersQuery, Types.GetUsersQueryVariables>(GetUsersDocument, variables),
    ...options,
  });
};

useGetUsersQuery.getKey = (variables?: Types.GetUsersQueryVariables) =>
  variables === undefined ? ['GetUsers'] : ['GetUsers', variables];

useGetUsersQuery.fetcher = (variables?: Types.GetUsersQueryVariables, options?: RequestInit['headers']) =>
  fetcher<Types.GetUsersQuery, Types.GetUsersQueryVariables>(GetUsersDocument, variables, options);
