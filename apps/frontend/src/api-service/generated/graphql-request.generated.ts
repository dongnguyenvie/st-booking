// @ts-nocheck
import * as Types from './graphql.generated';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import * as Operations from './graphql.generated';
export * from './graphql.generated';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetMyApiKeys(
      variables?: Types.GetMyApiKeysQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetMyApiKeysQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetMyApiKeysQuery>({
            document: Operations.GetMyApiKeysDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetMyApiKeys',
        'query',
        variables,
      );
    },
    CreateApiKey(
      variables: Types.CreateApiKeyMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.CreateApiKeyMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.CreateApiKeyMutation>({
            document: Operations.CreateApiKeyDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'CreateApiKey',
        'mutation',
        variables,
      );
    },
    DeleteApiKey(
      variables: Types.DeleteApiKeyMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.DeleteApiKeyMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.DeleteApiKeyMutation>({
            document: Operations.DeleteApiKeyDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'DeleteApiKey',
        'mutation',
        variables,
      );
    },
    SignIn(
      variables: Types.SignInMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.SignInMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.SignInMutation>({
            document: Operations.SignInDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'SignIn',
        'mutation',
        variables,
      );
    },
    VerifyTwoFactor(
      variables: Types.VerifyTwoFactorMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.VerifyTwoFactorMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.VerifyTwoFactorMutation>({
            document: Operations.VerifyTwoFactorDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'VerifyTwoFactor',
        'mutation',
        variables,
      );
    },
    MyAccess(
      variables?: Types.MyAccessQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.MyAccessQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.MyAccessQuery>({
            document: Operations.MyAccessDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'MyAccess',
        'query',
        variables,
      );
    },
    ResendTwoFactorEmail(
      variables: Types.ResendTwoFactorEmailMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.ResendTwoFactorEmailMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.ResendTwoFactorEmailMutation>({
            document: Operations.ResendTwoFactorEmailDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'ResendTwoFactorEmail',
        'mutation',
        variables,
      );
    },
    SignInByAuth0(
      variables: Types.SignInByAuth0MutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.SignInByAuth0Mutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.SignInByAuth0Mutation>({
            document: Operations.SignInByAuth0Document,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'SignInByAuth0',
        'mutation',
        variables,
      );
    },
    RegisterUser(
      variables: Types.RegisterUserMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.RegisterUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.RegisterUserMutation>({
            document: Operations.RegisterUserDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'RegisterUser',
        'mutation',
        variables,
      );
    },
    GetDashboardStats(
      variables?: Types.GetDashboardStatsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetDashboardStatsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetDashboardStatsQuery>({
            document: Operations.GetDashboardStatsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetDashboardStats',
        'query',
        variables,
      );
    },
    GetRoles(
      variables?: Types.GetRolesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetRolesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetRolesQuery>({
            document: Operations.GetRolesDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetRoles',
        'query',
        variables,
      );
    },
    GetRole(
      variables: Types.GetRoleQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetRoleQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetRoleQuery>({
            document: Operations.GetRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetRole',
        'query',
        variables,
      );
    },
    GetPermissions(
      variables?: Types.GetPermissionsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetPermissionsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetPermissionsQuery>({
            document: Operations.GetPermissionsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetPermissions',
        'query',
        variables,
      );
    },
    GetUserRoles(
      variables: Types.GetUserRolesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetUserRolesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetUserRolesQuery>({
            document: Operations.GetUserRolesDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetUserRoles',
        'query',
        variables,
      );
    },
    CreateRole(
      variables: Types.CreateRoleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.CreateRoleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.CreateRoleMutation>({
            document: Operations.CreateRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'CreateRole',
        'mutation',
        variables,
      );
    },
    UpdateRole(
      variables: Types.UpdateRoleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.UpdateRoleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.UpdateRoleMutation>({
            document: Operations.UpdateRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'UpdateRole',
        'mutation',
        variables,
      );
    },
    DeleteRole(
      variables: Types.DeleteRoleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.DeleteRoleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.DeleteRoleMutation>({
            document: Operations.DeleteRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'DeleteRole',
        'mutation',
        variables,
      );
    },
    SetRolePermissions(
      variables: Types.SetRolePermissionsMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.SetRolePermissionsMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.SetRolePermissionsMutation>({
            document: Operations.SetRolePermissionsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'SetRolePermissions',
        'mutation',
        variables,
      );
    },
    AssignRoleToUser(
      variables: Types.AssignRoleToUserMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.AssignRoleToUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.AssignRoleToUserMutation>({
            document: Operations.AssignRoleToUserDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'AssignRoleToUser',
        'mutation',
        variables,
      );
    },
    RemoveRoleFromUser(
      variables: Types.RemoveRoleFromUserMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.RemoveRoleFromUserMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.RemoveRoleFromUserMutation>({
            document: Operations.RemoveRoleFromUserDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'RemoveRoleFromUser',
        'mutation',
        variables,
      );
    },
    SetDefaultRole(
      variables: Types.SetDefaultRoleMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.SetDefaultRoleMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.SetDefaultRoleMutation>({
            document: Operations.SetDefaultRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'SetDefaultRole',
        'mutation',
        variables,
      );
    },
    Me(
      variables?: Types.MeQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.MeQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.MeQuery>({
            document: Operations.MeDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'Me',
        'query',
        variables,
      );
    },
    TwoFactorSetupInit(
      variables: Types.TwoFactorSetupInitMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.TwoFactorSetupInitMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.TwoFactorSetupInitMutation>({
            document: Operations.TwoFactorSetupInitDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'TwoFactorSetupInit',
        'mutation',
        variables,
      );
    },
    TwoFactorSetupVerify(
      variables: Types.TwoFactorSetupVerifyMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.TwoFactorSetupVerifyMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.TwoFactorSetupVerifyMutation>({
            document: Operations.TwoFactorSetupVerifyDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'TwoFactorSetupVerify',
        'mutation',
        variables,
      );
    },
    TwoFactorDisable(
      variables: Types.TwoFactorDisableMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.TwoFactorDisableMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.TwoFactorDisableMutation>({
            document: Operations.TwoFactorDisableDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'TwoFactorDisable',
        'mutation',
        variables,
      );
    },
    GetUsers(
      variables?: Types.GetUsersQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<Types.GetUsersQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<Types.GetUsersQuery>({
            document: Operations.GetUsersDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'GetUsers',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
