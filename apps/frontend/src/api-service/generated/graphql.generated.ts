export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Date scalar (ISO 8601 string ↔ Date object) */
  Date: { input: any; output: any };
};

export type ApiKey = {
  _count: ApiKeyCount;
  createdAt: Scalars['Date']['output'];
  createdByUser?: Maybe<User>;
  createdByUserId?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  roles?: Maybe<Array<ApiKeyRole>>;
  updatedAt: Scalars['Date']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type ApiKeyCount = {
  roles: Scalars['Int']['output'];
};

export type ApiKeyDataOutput = {
  data: ApiKeyOutput;
};

export type ApiKeyOutput = {
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  roleIds: Array<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
};

export type ApiKeyRole = {
  apiKey: ApiKey;
  apiKeyId: Scalars['String']['output'];
  role: Role;
  roleId: Scalars['String']['output'];
};

export type ApiKeysPaginatedOutput = {
  data: Array<ApiKeyOutput>;
  meta: MetaOutput;
};

export type Business = {
  _count: BusinessCount;
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
  roles?: Maybe<Array<Role>>;
  state?: Maybe<Scalars['String']['output']>;
  taxIdLabel?: Maybe<Scalars['String']['output']>;
  taxIdNumber?: Maybe<Scalars['String']['output']>;
  tradeName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  users?: Maybe<Array<User>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type BusinessCount = {
  roles: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type CreateApiKeyInput = {
  name: Scalars['String']['input'];
  roleIds?: Array<Scalars['String']['input']>;
};

export type CreateRoleInput = {
  businessId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  permissionKeys?: Array<Scalars['String']['input']>;
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
  /** Assign a role to a user */
  assignRoleToUser: RoleDataOutput;
  /** Create an API key for the current user */
  createApiKey: ApiKeyDataOutput;
  /** Create a new role */
  createRole: RoleDataOutput;
  /** Delete (soft-delete) an API key */
  deleteApiKey: ApiKeyDataOutput;
  /** Soft-delete a role */
  deleteRole: RoleDataOutput;
  registerUser: RegisterUserDataOutput;
  /** Remove a role from a user */
  removeRoleFromUser: RoleDataOutput;
  resendTwoFactorEmail: ResendTwoFactorEmailOutput;
  /** Make this the role granted to new self-signups */
  setDefaultRole: RoleDataOutput;
  /** Replace a role's permission set */
  setRolePermissions: RoleDataOutput;
  signIn: SignInDataOutput;
  signInByAuth0: SignInByAuth0DataOutput;
  twoFactorDisable: TwoFactorResultOutput;
  twoFactorSetupInit: TwoFactorSetupInitOutput;
  twoFactorSetupVerify: TwoFactorResultOutput;
  /** Update a role */
  updateRole: RoleDataOutput;
  updateUserPrivileges: UpdateUserPrivilegesDataOutput;
  verifyTwoFactor: VerifyTwoFactorDataOutput;
};

export type MutationAssignRoleToUserArgs = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
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
  _count: PermissionCount;
  action: Scalars['String']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  key: Scalars['String']['output'];
  resource: Scalars['String']['output'];
  rolePermissions?: Maybe<Array<RolePermission>>;
  updatedAt: Scalars['Date']['output'];
};

export type PermissionCount = {
  rolePermissions: Scalars['Int']['output'];
};

export type PermissionsPaginatedOutput = {
  data: Array<Permission>;
  meta: MetaOutput;
};

export type Query = {
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
  /** Get roles assigned to a user */
  getUserRoles: RolesPaginatedOutput;
  /** List all users */
  getUsers: GetUsersOutput;
  /** GraphQL health check */
  gqlHealth: Scalars['String']['output'];
  me: User;
  /** Current user roles and permissions */
  myAccess: MyAccessDataOutput;
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
  _count: RoleCount;
  apiKeys?: Maybe<Array<ApiKeyRole>>;
  business?: Maybe<Business>;
  businessId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  createdByUserId?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  /**
   * Role granted to new self-signups. Exactly one role should carry this —
   * enforced in RoleService.setDefault (a transaction that clears the rest),
   * since Prisma cannot express a partial unique index.
   */
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  rolePermissions?: Maybe<Array<RolePermission>>;
  updatedAt: Scalars['Date']['output'];
  userRoles?: Maybe<Array<UserRole>>;
};

export type RoleCount = {
  apiKeys: Scalars['Int']['output'];
  rolePermissions: Scalars['Int']['output'];
  userRoles: Scalars['Int']['output'];
};

export type RoleDataOutput = {
  data: Role;
};

export type RolePermission = {
  permission: Permission;
  permissionId: Scalars['String']['output'];
  role: Role;
  roleId: Scalars['String']['output'];
};

export type RolesPaginatedOutput = {
  data: Array<Role>;
  meta: MetaOutput;
};

export type SetRolePermissionsInput = {
  permissionKeys?: Array<Scalars['String']['input']>;
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
  TOTP = 'TOTP',
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
  apiKeys?: Maybe<Array<ApiKey>>;
  business?: Maybe<Business>;
  businessId?: Maybe<Scalars['String']['output']>;
  createdApiKeys?: Maybe<Array<ApiKey>>;
  createdAt: Scalars['Date']['output'];
  deletedAt?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  kycStatus?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  privileges?: Maybe<Array<Scalars['Int']['output']>>;
  twoFactorChallenges?: Maybe<Array<TwoFactorChallenge>>;
  twoFactorEnabled: Scalars['Boolean']['output'];
  twoFactorEnabledAt?: Maybe<Scalars['Date']['output']>;
  twoFactorMethod?: Maybe<TwoFactorMethod>;
  updatedAt: Scalars['Date']['output'];
  userRoles?: Maybe<Array<UserRole>>;
};

export type UserCount = {
  apiKeys: Scalars['Int']['output'];
  createdApiKeys: Scalars['Int']['output'];
  twoFactorChallenges: Scalars['Int']['output'];
  userRoles: Scalars['Int']['output'];
};

export type UserRole = {
  createdAt: Scalars['Date']['output'];
  lenderWorkspaceId?: Maybe<Scalars['String']['output']>;
  role: Role;
  roleId: Scalars['String']['output'];
  user: User;
  userId: Scalars['String']['output'];
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

export type GetMyApiKeysQuery = {
  getMyApiKeys: {
    data: Array<{
      id: string;
      name: string;
      roleIds: Array<string>;
      userId: string;
      createdAt: any;
      updatedAt: any;
    }>;
    meta: { total: number; page: number; limit: number };
  };
};

export type CreateApiKeyMutationVariables = Exact<{
  input: CreateApiKeyInput;
}>;

export type CreateApiKeyMutation = {
  createApiKey: {
    data: {
      id: string;
      name: string;
      key?: string | null;
      roleIds: Array<string>;
      userId: string;
      createdAt: any;
      updatedAt: any;
    };
  };
};

export type DeleteApiKeyMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteApiKeyMutation = { deleteApiKey: { data: { id: string } } };

export type SignInMutationVariables = Exact<{
  input: SignInInput;
}>;

export type SignInMutation = {
  signIn: {
    data: {
      accessToken?: string | null;
      twoFactorRequired: boolean;
      preAuthToken?: string | null;
      twoFactorMethod?: TwoFactorMethod | null;
      user?: { id: string; email: string; name?: string | null; privileges?: Array<number> | null } | null;
    };
  };
};

export type VerifyTwoFactorMutationVariables = Exact<{
  input: VerifyTwoFactorInput;
}>;

export type VerifyTwoFactorMutation = {
  verifyTwoFactor: {
    data: {
      accessToken: string;
      user: { id: string; email: string; name?: string | null; privileges?: Array<number> | null };
    };
  };
};

export type MyAccessQueryVariables = Exact<{ [key: string]: never }>;

export type MyAccessQuery = { myAccess: { data: { roles: Array<string>; permissions: Array<string> } } };

export type ResendTwoFactorEmailMutationVariables = Exact<{
  input: ResendTwoFactorEmailInput;
}>;

export type ResendTwoFactorEmailMutation = { resendTwoFactorEmail: { sent: boolean } };

export type SignInByAuth0MutationVariables = Exact<{
  input: SignInByAuth0Input;
}>;

export type SignInByAuth0Mutation = {
  signInByAuth0: {
    data: {
      accessToken: string;
      user: { id: string; email: string; name?: string | null; privileges?: Array<number> | null };
    };
  };
};

export type RegisterUserMutationVariables = Exact<{
  input: RegisterUserInput;
}>;

export type RegisterUserMutation = {
  registerUser: {
    data: {
      accessToken: string;
      user: { id: string; email: string; name?: string | null; privileges?: Array<number> | null };
    };
  };
};

export type GetDashboardStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDashboardStatsQuery = {
  getDashboardStats: { data: { totalUsers: number; activeUsers: number; totalRoles: number } };
};

export type GetRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetRolesQuery = {
  getRoles: {
    data: Array<{
      id: string;
      name: string;
      description?: string | null;
      isDefault: boolean;
      createdAt: any;
      updatedAt: any;
      rolePermissions?: Array<{
        permission: {
          id: string;
          key: string;
          resource: string;
          action: string;
          description?: string | null;
        };
      }> | null;
    }>;
    meta: { total: number; page: number; limit: number };
  };
};

export type GetRoleQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type GetRoleQuery = {
  getRole: {
    data: {
      id: string;
      name: string;
      description?: string | null;
      isDefault: boolean;
      createdAt: any;
      updatedAt: any;
      rolePermissions?: Array<{
        permission: {
          id: string;
          key: string;
          resource: string;
          action: string;
          description?: string | null;
        };
      }> | null;
    };
  };
};

export type GetPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetPermissionsQuery = {
  getPermissions: {
    data: Array<{ id: string; key: string; resource: string; action: string; description?: string | null }>;
    meta: { total: number; page: number; limit: number };
  };
};

export type GetUserRolesQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetUserRolesQuery = {
  getUserRoles: {
    data: Array<{
      id: string;
      name: string;
      description?: string | null;
      rolePermissions?: Array<{ permission: { key: string } }> | null;
    }>;
    meta: { total: number; page: number; limit: number };
  };
};

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;

export type CreateRoleMutation = {
  createRole: {
    data: {
      id: string;
      name: string;
      description?: string | null;
      rolePermissions?: Array<{ permission: { key: string } }> | null;
    };
  };
};

export type UpdateRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateRoleInput;
}>;

export type UpdateRoleMutation = {
  updateRole: { data: { id: string; name: string; description?: string | null } };
};

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteRoleMutation = { deleteRole: { data: { id: string } } };

export type SetRolePermissionsMutationVariables = Exact<{
  input: SetRolePermissionsInput;
}>;

export type SetRolePermissionsMutation = {
  setRolePermissions: {
    data: { id: string; name: string; rolePermissions?: Array<{ permission: { key: string } }> | null };
  };
};

export type AssignRoleToUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
}>;

export type AssignRoleToUserMutation = { assignRoleToUser: { data: { id: string; name: string } } };

export type RemoveRoleFromUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
}>;

export type RemoveRoleFromUserMutation = { removeRoleFromUser: { data: { id: string; name: string } } };

export type SetDefaultRoleMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type SetDefaultRoleMutation = {
  setDefaultRole: { data: { id: string; name: string; isDefault: boolean } };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  me: {
    id: string;
    email: string;
    name?: string | null;
    privileges?: Array<number> | null;
    twoFactorEnabled: boolean;
    twoFactorMethod?: TwoFactorMethod | null;
  };
};

export type TwoFactorSetupInitMutationVariables = Exact<{
  method: TwoFactorMethod;
}>;

export type TwoFactorSetupInitMutation = {
  twoFactorSetupInit: { secret?: string | null; qrCodeDataUrl?: string | null; challengeId?: string | null };
};

export type TwoFactorSetupVerifyMutationVariables = Exact<{
  input: TwoFactorSetupVerifyInput;
}>;

export type TwoFactorSetupVerifyMutation = { twoFactorSetupVerify: { success: boolean } };

export type TwoFactorDisableMutationVariables = Exact<{
  input: TwoFactorDisableInput;
}>;

export type TwoFactorDisableMutation = { twoFactorDisable: { success: boolean } };

export type GetUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetUsersQuery = {
  getUsers: {
    data: Array<{
      id: string;
      email: string;
      name?: string | null;
      isActive: boolean;
      privileges?: Array<number> | null;
      createdAt: any;
    }>;
    meta: { total: number; page: number; limit: number };
  };
};
