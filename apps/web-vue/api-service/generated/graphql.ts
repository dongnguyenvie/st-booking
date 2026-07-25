/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date scalar (ISO 8601 string ↔ Date object) */
  Date: { input: any; output: any; }
};

export type AccessPoliciesPaginatedOutput = {
  data: Array<AccessPolicy>;
  meta: MetaOutput;
};

export type AccessPolicy = {
  _count: AccessPolicyCount;
  apiKeys?: Maybe<Array<ApiKeyAccessPolicy>>;
  business?: Maybe<Business>;
  businessId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdByUserId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  scopes?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['Date']['output'];
  users?: Maybe<Array<User>>;
};

export type AccessPolicyCount = {
  apiKeys: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type AccessPolicyDataOutput = {
  data: AccessPolicy;
};

export type ApiKey = {
  _count: ApiKeyCount;
  accessPolicies?: Maybe<Array<ApiKeyAccessPolicy>>;
  createdAt: Scalars['Date']['output'];
  createdByUser?: Maybe<User>;
  createdByUserId?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type ApiKeyAccessPolicy = {
  accessPolicy: AccessPolicy;
  accessPolicyId: Scalars['String']['output'];
  apiKey: ApiKey;
  apiKeyId: Scalars['String']['output'];
};

export type ApiKeyCount = {
  accessPolicies: Scalars['Int']['output'];
};

export type ApiKeyDataOutput = {
  data: ApiKeyOutput;
};

export type ApiKeyOutput = {
  accessPolicyIds: Array<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
};

export type ApiKeysPaginatedOutput = {
  data: Array<ApiKeyOutput>;
  meta: MetaOutput;
};

export type Business = {
  _count: BusinessCount;
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  defaultPaymentTerms?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoiceFooterNote?: Maybe<Scalars['String']['output']>;
  legalName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  taxIdLabel?: Maybe<Scalars['String']['output']>;
  taxIdNumber?: Maybe<Scalars['String']['output']>;
  tradeName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  users?: Maybe<Array<User>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type BusinessCount = {
  accessPolicies: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type CreateAccessPolicyInput = {
  businessId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissions?: Array<Scalars['String']['input']>;
  scopes?: Array<Scalars['String']['input']>;
};

export type CreateApiKeyInput = {
  accessPolicyIds?: Array<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateRoleInput = {
  businessId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissionKeys?: Array<Scalars['String']['input']>;
};

export type GetAvailableScopesDataOutput = {
  data: GetAvailableScopesOutput;
};

export type GetAvailableScopesInput = {
  includeGraphql?: InputMaybe<Scalars['Boolean']['input']>;
  includePermissions?: InputMaybe<Scalars['Boolean']['input']>;
  includeRest?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GetAvailableScopesOutput = {
  graphql?: Maybe<Array<Scalars['String']['output']>>;
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  rest?: Maybe<Array<Scalars['String']['output']>>;
};

export type GetDashboardStatsDataOutput = {
  data: GetDashboardStatsOutput;
};

export type GetDashboardStatsOutput = {
  activeUsers: Scalars['Int']['output'];
  totalRoles: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type GetUsersOutput = {
  data: Array<User>;
  meta: MetaOutput;
};

export type MetaOutput = {
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type Mutation = {
  /** Assign an access policy to a user */
  assignPolicyToUser: AccessPolicyDataOutput;
  /** Assign a role to a user */
  assignRoleToUser: RoleDataOutput;
  /** Create a new access policy */
  createAccessPolicy: AccessPolicyDataOutput;
  /** Create an API key for the current user */
  createApiKey: ApiKeyDataOutput;
  /** Create a new role */
  createRole: RoleDataOutput;
  /** Delete (soft-delete) an API key */
  deleteApiKey: ApiKeyDataOutput;
  /** Soft-delete a role */
  deleteRole: RoleDataOutput;
  registerUser: RegisterUserDataOutput;
  /** Remove an access policy from a user */
  removePolicyFromUser: AccessPolicyDataOutput;
  /** Remove a role from a user */
  removeRoleFromUser: RoleDataOutput;
  resendTwoFactorEmail: ResendTwoFactorEmailOutput;
  /** Mark a role as the default granted to new self-signups */
  setDefaultRole: RoleDataOutput;
  /** Replace the full permission set of a role */
  setRolePermissions: RoleDataOutput;
  signIn: SignInDataOutput;
  signInByAuth0: SignInByAuth0DataOutput;
  twoFactorDisable: TwoFactorResultOutput;
  twoFactorSetupInit: TwoFactorSetupInitOutput;
  twoFactorSetupVerify: TwoFactorResultOutput;
  /** Update an access policy */
  updateAccessPolicy: AccessPolicyDataOutput;
  /** Update a role */
  updateRole: RoleDataOutput;
  updateUserPrivileges: UpdateUserPrivilegesDataOutput;
  verifyTwoFactor: VerifyTwoFactorDataOutput;
};


export type MutationAssignPolicyToUserArgs = {
  policyId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAssignRoleToUserArgs = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateAccessPolicyArgs = {
  input: CreateAccessPolicyInput;
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationDeleteApiKeyArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationRemovePolicyFromUserArgs = {
  policyId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationRemoveRoleFromUserArgs = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationResendTwoFactorEmailArgs = {
  input: ResendTwoFactorEmailInput;
};


export type MutationSetDefaultRoleArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetRolePermissionsArgs = {
  input: SetRolePermissionsInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignInByAuth0Args = {
  input: SignInByAuth0Input;
};


export type MutationTwoFactorDisableArgs = {
  input: TwoFactorDisableInput;
};


export type MutationTwoFactorSetupInitArgs = {
  method: TwoFactorMethod;
};


export type MutationTwoFactorSetupVerifyArgs = {
  input: TwoFactorSetupVerifyInput;
};


export type MutationUpdateAccessPolicyArgs = {
  id: Scalars['String']['input'];
  input: UpdateAccessPolicyInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['String']['input'];
  input: UpdateRoleInput;
};


export type MutationUpdateUserPrivilegesArgs = {
  input: UpdateUserPrivilegesInput;
};


export type MutationVerifyTwoFactorArgs = {
  input: VerifyTwoFactorInput;
};

export type MyAccessDataOutput = {
  data: MyAccessOutput;
};

export type MyAccessOutput = {
  permissions: Array<Scalars['String']['output']>;
  roles: Array<Scalars['String']['output']>;
};

export type PaginationInput = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type Permission = {
  action: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  resource: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type PermissionsPaginatedOutput = {
  data: Array<Permission>;
  meta: MetaOutput;
};

export type Query = {
  /** List all access policies */
  getAccessPolicies: AccessPoliciesPaginatedOutput;
  /** Get all available API scopes and permission flags */
  getAvailableScopes: GetAvailableScopesDataOutput;
  /** Get dashboard statistics */
  getDashboardStats: GetDashboardStatsDataOutput;
  /** Get my API keys */
  getMyApiKeys: ApiKeysPaginatedOutput;
  /** List the permission catalog */
  getPermissions: PermissionsPaginatedOutput;
  /** Get a single role by id */
  getRole: RoleDataOutput;
  /** List all roles */
  getRoles: RolesPaginatedOutput;
  /** Get access policies assigned to a user */
  getUserAccessPolicies: AccessPoliciesPaginatedOutput;
  /** List roles assigned to a user */
  getUserRoles: RolesPaginatedOutput;
  /** List all users */
  getUsers: GetUsersOutput;
  /** GraphQL health check */
  gqlHealth: Scalars['String']['output'];
  me: User;
  /** Roles and permission keys resolved for the current user */
  myAccess: MyAccessDataOutput;
};


export type QueryGetAccessPoliciesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetAvailableScopesArgs = {
  input?: InputMaybe<GetAvailableScopesInput>;
};


export type QueryGetMyApiKeysArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetPermissionsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetRoleArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetRolesArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryGetUserAccessPoliciesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryGetUserRolesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  userId: Scalars['String']['input'];
};


export type QueryGetUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type RegisterUserDataOutput = {
  data: RegisterUserOutput;
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RegisterUserOutput = {
  accessToken: Scalars['String']['output'];
  user: User;
};

export type ResendTwoFactorEmailInput = {
  preAuthToken: Scalars['String']['input'];
};

export type ResendTwoFactorEmailOutput = {
  sent: Scalars['Boolean']['output'];
};

export type Role = {
  businessId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdByUserId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rolePermissions?: Maybe<Array<RolePermission>>;
  updatedAt: Scalars['Date']['output'];
};

export type RoleDataOutput = {
  data: Role;
};

export type RolePermission = {
  permission: Permission;
  permissionId: Scalars['String']['output'];
  roleId: Scalars['String']['output'];
};

export type RolesPaginatedOutput = {
  data: Array<Role>;
  meta: MetaOutput;
};

export type SetRolePermissionsInput = {
  permissionKeys: Array<Scalars['String']['input']>;
  roleId: Scalars['String']['input'];
};

export type SignInByAuth0DataOutput = {
  data: SignInByAuth0Output;
};

export type SignInByAuth0Input = {
  accessToken: Scalars['String']['input'];
};

export type SignInByAuth0Output = {
  accessToken: Scalars['String']['output'];
  user: User;
};

export type SignInDataOutput = {
  data: SignInOutput;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInOutput = {
  accessToken?: Maybe<Scalars['String']['output']>;
  preAuthToken?: Maybe<Scalars['String']['output']>;
  twoFactorMethod?: Maybe<TwoFactorMethod>;
  twoFactorRequired: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export type TwoFactorChallenge = {
  attempts: Scalars['Int']['output'];
  codeHash: Scalars['String']['output'];
  consumedAt?: Maybe<Scalars['Date']['output']>;
  createdAt: Scalars['Date']['output'];
  expiresAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  method: TwoFactorMethod;
  user: User;
  userId: Scalars['String']['output'];
};

export type TwoFactorDisableInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

/** Two-factor authentication method */
export enum TwoFactorMethod {
  EMAIL = 'EMAIL',
  TOTP = 'TOTP'
}

export type TwoFactorResultOutput = {
  success: Scalars['Boolean']['output'];
};

export type TwoFactorSetupInitOutput = {
  challengeId?: Maybe<Scalars['String']['output']>;
  qrCodeDataUrl?: Maybe<Scalars['String']['output']>;
  secret?: Maybe<Scalars['String']['output']>;
};

export type TwoFactorSetupVerifyInput = {
  code: Scalars['String']['input'];
  method: TwoFactorMethod;
};

export type UpdateAccessPolicyInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  scopes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserPrivilegesDataOutput = {
  data: User;
};

export type UpdateUserPrivilegesInput = {
  privileges: Array<Scalars['Int']['input']>;
  userId: Scalars['String']['input'];
};

export type User = {
  _count: UserCount;
  accessPolicies?: Maybe<Array<AccessPolicy>>;
  apiKeys?: Maybe<Array<ApiKey>>;
  business?: Maybe<Business>;
  businessId?: Maybe<Scalars['String']['output']>;
  createdApiKeys?: Maybe<Array<ApiKey>>;
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  name?: Maybe<Scalars['String']['output']>;
  privileges?: Maybe<Array<Scalars['Int']['output']>>;
  twoFactorChallenges?: Maybe<Array<TwoFactorChallenge>>;
  twoFactorEnabled: Scalars['Boolean']['output'];
  twoFactorEnabledAt?: Maybe<Scalars['Date']['output']>;
  twoFactorMethod?: Maybe<TwoFactorMethod>;
  updatedAt: Scalars['Date']['output'];
};

export type UserCount = {
  accessPolicies: Scalars['Int']['output'];
  apiKeys: Scalars['Int']['output'];
  createdApiKeys: Scalars['Int']['output'];
  twoFactorChallenges: Scalars['Int']['output'];
};

export type VerifyTwoFactorDataOutput = {
  data: VerifyTwoFactorOutput;
};

export type VerifyTwoFactorInput = {
  code: Scalars['String']['input'];
  preAuthToken: Scalars['String']['input'];
};

export type VerifyTwoFactorOutput = {
  accessToken: Scalars['String']['output'];
  user: User;
};

export type GetMyApiKeysQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetMyApiKeysQuery = { getMyApiKeys: { data: Array<{ id: string, name: string, accessPolicyIds: Array<string>, userId: string, createdAt: any }>, meta: { total: number, page: number, limit: number } } };

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;


export type CreateApiKeyMutation = { createApiKey: { data: { id: string, name: string, key?: string | null } } };

export type DeleteApiKeyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteApiKeyMutation = { deleteApiKey: { data: { id: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;


export type SignInMutation = { signIn: { data: { accessToken?: string | null, twoFactorRequired: boolean, preAuthToken?: string | null, twoFactorMethod?: TwoFactorMethod | null, user?: { id: string, email: string, name?: string | null, privileges?: Array<number> | null } | null } } };

export type SignInByAuth0MutationVariables = Exact<{
  input: SignInByAuth0Input;
}>;


export type SignInByAuth0Mutation = { signInByAuth0: { data: { accessToken: string, user: { id: string, email: string, name?: string | null, privileges?: Array<number> | null } } } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { registerUser: { data: { accessToken: string, user: { id: string, email: string, name?: string | null, privileges?: Array<number> | null } } } };

export type VerifyTwoFactorMutationVariables = Exact<{
  input: VerifyTwoFactorInput;
}>;


export type VerifyTwoFactorMutation = { verifyTwoFactor: { data: { accessToken: string, user: { id: string, email: string, name?: string | null, privileges?: Array<number> | null } } } };

export type ResendTwoFactorEmailMutationVariables = Exact<{
  input: ResendTwoFactorEmailInput;
}>;


export type ResendTwoFactorEmailMutation = { resendTwoFactorEmail: { sent: boolean } };

export type TwoFactorSetupInitMutationVariables = Exact<{
  method: TwoFactorMethod;
}>;


export type TwoFactorSetupInitMutation = { twoFactorSetupInit: { secret?: string | null, qrCodeDataUrl?: string | null, challengeId?: string | null } };

export type TwoFactorSetupVerifyMutationVariables = Exact<{
  input: TwoFactorSetupVerifyInput;
}>;


export type TwoFactorSetupVerifyMutation = { twoFactorSetupVerify: { success: boolean } };

export type TwoFactorDisableMutationVariables = Exact<{
  input: TwoFactorDisableInput;
}>;


export type TwoFactorDisableMutation = { twoFactorDisable: { success: boolean } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email: string, name?: string | null, privileges?: Array<number> | null, twoFactorEnabled: boolean, twoFactorMethod?: TwoFactorMethod | null, twoFactorEnabledAt?: any | null } };

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDashboardStatsQuery = { getDashboardStats: { data: { totalUsers: number, activeUsers: number, totalRoles: number } } };

export type GetAvailableScopesQueryVariables = Exact<{
  input?: InputMaybe<GetAvailableScopesInput>;
}>;


export type GetAvailableScopesQuery = { getAvailableScopes: { data: { graphql?: Array<string> | null, rest?: Array<string> | null, permissions?: Array<string> | null } } };

export type GetAccessPoliciesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetAccessPoliciesQuery = { getAccessPolicies: { data: Array<{ id: string, name: string, description?: string | null, permissions?: Array<string> | null, scopes?: Array<string> | null, businessId?: string | null, createdAt: any }>, meta: { total: number, page: number, limit: number } } };

export type GetUserAccessPoliciesQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUserAccessPoliciesQuery = { getUserAccessPolicies: { data: Array<{ id: string, name: string, description?: string | null, permissions?: Array<string> | null, scopes?: Array<string> | null }>, meta: { total: number, page: number, limit: number } } };

export type CreateAccessPolicyMutationVariables = Exact<{
  input: CreateAccessPolicyInput;
}>;


export type CreateAccessPolicyMutation = { createAccessPolicy: { data: { id: string, name: string, description?: string | null, permissions?: Array<string> | null, scopes?: Array<string> | null } } };

export type UpdateAccessPolicyMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateAccessPolicyInput;
}>;


export type UpdateAccessPolicyMutation = { updateAccessPolicy: { data: { id: string, name: string, description?: string | null, permissions?: Array<string> | null, scopes?: Array<string> | null } } };

export type AssignPolicyToUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  policyId: Scalars['String']['input'];
}>;


export type AssignPolicyToUserMutation = { assignPolicyToUser: { data: { id: string } } };

export type RemovePolicyFromUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  policyId: Scalars['String']['input'];
}>;


export type RemovePolicyFromUserMutation = { removePolicyFromUser: { data: { id: string } } };

export type GetRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetRolesQuery = { getRoles: { data: Array<{ id: string, name: string, description?: string | null, isDefault: boolean, createdAt: any, updatedAt: any, rolePermissions?: Array<{ permission: { id: string, key: string, resource: string, action: string, description?: string | null } }> | null }>, meta: { total: number, page: number, limit: number } } };

export type GetRoleQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetRoleQuery = { getRole: { data: { id: string, name: string, description?: string | null, isDefault: boolean, createdAt: any, updatedAt: any, rolePermissions?: Array<{ permission: { id: string, key: string, resource: string, action: string, description?: string | null } }> | null } } };

export type GetPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetPermissionsQuery = { getPermissions: { data: Array<{ id: string, key: string, resource: string, action: string, description?: string | null }>, meta: { total: number, page: number, limit: number } } };

export type GetUserRolesQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUserRolesQuery = { getUserRoles: { data: Array<{ id: string, name: string, description?: string | null, isDefault: boolean, rolePermissions?: Array<{ permission: { key: string } }> | null }>, meta: { total: number, page: number, limit: number } } };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: { data: { id: string, name: string, description?: string | null, isDefault: boolean, rolePermissions?: Array<{ permission: { key: string } }> | null } } };

export type UpdateRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: { data: { id: string, name: string, description?: string | null } } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteRoleMutation = { deleteRole: { data: { id: string } } };

export type SetRolePermissionsMutationVariables = Exact<{
  input: SetRolePermissionsInput;
}>;


export type SetRolePermissionsMutation = { setRolePermissions: { data: { id: string, name: string, rolePermissions?: Array<{ permission: { key: string } }> | null } } };

export type SetDefaultRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SetDefaultRoleMutation = { setDefaultRole: { data: { id: string, name: string, isDefault: boolean } } };

export type AssignRoleToUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
}>;


export type AssignRoleToUserMutation = { assignRoleToUser: { data: { id: string, name: string } } };

export type RemoveRoleFromUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
}>;


export type RemoveRoleFromUserMutation = { removeRoleFromUser: { data: { id: string, name: string } } };

export type UpdateUserPrivilegesMutationVariables = Exact<{
  input: UpdateUserPrivilegesInput;
}>;


export type UpdateUserPrivilegesMutation = { updateUserPrivileges: { data: { id: string, privileges?: Array<number> | null } } };

export type GetUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type GetUsersQuery = { getUsers: { data: Array<{ id: string, email: string, name?: string | null, isActive: boolean, privileges?: Array<number> | null, createdAt: any }>, meta: { total: number, page: number, limit: number } } };


export const GetMyApiKeysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyApiKeys"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMyApiKeys"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accessPolicyIds"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyApiKeysQuery, GetMyApiKeysQueryVariables>;
export const CreateApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateApiKeyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]} as unknown as DocumentNode<CreateApiKeyMutation, CreateApiKeyMutationVariables>;
export const DeleteApiKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteApiKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteApiKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteApiKeyMutation, DeleteApiKeyMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorRequired"}},{"kind":"Field","name":{"kind":"Name","value":"preAuthToken"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorMethod"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignInByAuth0Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignInByAuth0"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInByAuth0Input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInByAuth0"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SignInByAuth0Mutation, SignInByAuth0MutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const VerifyTwoFactorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyTwoFactor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyTwoFactorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyTwoFactor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerifyTwoFactorMutation, VerifyTwoFactorMutationVariables>;
export const ResendTwoFactorEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendTwoFactorEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResendTwoFactorEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendTwoFactorEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sent"}}]}}]}}]} as unknown as DocumentNode<ResendTwoFactorEmailMutation, ResendTwoFactorEmailMutationVariables>;
export const TwoFactorSetupInitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TwoFactorSetupInit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"method"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorMethod"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSetupInit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"method"},"value":{"kind":"Variable","name":{"kind":"Name","value":"method"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"qrCodeDataUrl"}},{"kind":"Field","name":{"kind":"Name","value":"challengeId"}}]}}]}}]} as unknown as DocumentNode<TwoFactorSetupInitMutation, TwoFactorSetupInitMutationVariables>;
export const TwoFactorSetupVerifyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TwoFactorSetupVerify"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorSetupVerifyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorSetupVerify"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<TwoFactorSetupVerifyMutation, TwoFactorSetupVerifyMutationVariables>;
export const TwoFactorDisableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TwoFactorDisable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TwoFactorDisableInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"twoFactorDisable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<TwoFactorDisableMutation, TwoFactorDisableMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorMethod"}},{"kind":"Field","name":{"kind":"Name","value":"twoFactorEnabledAt"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const GetDashboardStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDashboardStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"activeUsers"}},{"kind":"Field","name":{"kind":"Name","value":"totalRoles"}}]}}]}}]}}]} as unknown as DocumentNode<GetDashboardStatsQuery, GetDashboardStatsQueryVariables>;
export const GetAvailableScopesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAvailableScopes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAvailableScopesInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAvailableScopes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graphql"}},{"kind":"Field","name":{"kind":"Name","value":"rest"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<GetAvailableScopesQuery, GetAvailableScopesQueryVariables>;
export const GetAccessPoliciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAccessPolicies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAccessPolicies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetAccessPoliciesQuery, GetAccessPoliciesQueryVariables>;
export const GetUserAccessPoliciesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserAccessPolicies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserAccessPolicies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserAccessPoliciesQuery, GetUserAccessPoliciesQueryVariables>;
export const CreateAccessPolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAccessPolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccessPolicyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccessPolicy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAccessPolicyMutation, CreateAccessPolicyMutationVariables>;
export const UpdateAccessPolicyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAccessPolicy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccessPolicyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAccessPolicy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateAccessPolicyMutation, UpdateAccessPolicyMutationVariables>;
export const AssignPolicyToUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignPolicyToUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"policyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignPolicyToUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"policyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"policyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AssignPolicyToUserMutation, AssignPolicyToUserMutationVariables>;
export const RemovePolicyFromUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemovePolicyFromUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"policyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePolicyFromUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"policyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"policyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RemovePolicyFromUserMutation, RemovePolicyFromUserMutationVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRoleQuery, GetRoleQueryVariables>;
export const GetPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"resource"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetUserRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserRoles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserRolesQuery, GetUserRolesQueryVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const SetRolePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetRolePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetRolePermissionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setRolePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rolePermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SetRolePermissionsMutation, SetRolePermissionsMutationVariables>;
export const SetDefaultRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDefaultRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDefaultRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]}}]} as unknown as DocumentNode<SetDefaultRoleMutation, SetDefaultRoleMutationVariables>;
export const AssignRoleToUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignRoleToUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignRoleToUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AssignRoleToUserMutation, AssignRoleToUserMutationVariables>;
export const RemoveRoleFromUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveRoleFromUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeRoleFromUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"roleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveRoleFromUserMutation, RemoveRoleFromUserMutationVariables>;
export const UpdateUserPrivilegesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserPrivileges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPrivilegesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserPrivileges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserPrivilegesMutation, UpdateUserPrivilegesMutationVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"privileges"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;