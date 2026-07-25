import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RoleService } from './services/role.service';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';
import { PoliciesGuard } from '@core/guards/policies.guard';
import { PermissionKey } from '@repo/core';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import {
  CreateRoleInput,
  UpdateRoleInput,
  SetRolePermissionsInput,
  RoleDataOutput,
  RolesPaginatedOutput,
  PermissionsPaginatedOutput,
} from './dtos/role.dto';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_READ] })
  @Query(() => RolesPaginatedOutput, { description: 'List all roles' })
  async getRoles(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<RolesPaginatedOutput> {
    return this.roleService.findAll(pagination);
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_READ] })
  @Query(() => RoleDataOutput, { description: 'Get a single role by id' })
  async getRole(@Args('id') id: string): Promise<RoleDataOutput> {
    return { data: await this.roleService.findOne(id) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.PERMISSION_READ] })
  @Query(() => PermissionsPaginatedOutput, { description: 'List the permission catalog' })
  async getPermissions(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PermissionsPaginatedOutput> {
    return this.roleService.listPermissions(pagination);
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_READ] })
  @Query(() => RolesPaginatedOutput, { description: 'Get roles assigned to a user' })
  async getUserRoles(
    @Args('userId') userId: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<RolesPaginatedOutput> {
    return this.roleService.findByUser(userId, pagination);
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: 'Create a new role' })
  async createRole(
    @Args('input') input: CreateRoleInput,
    @CurrentUser() user: { id: string },
  ): Promise<RoleDataOutput> {
    return { data: await this.roleService.create(input, user.id) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: 'Update a role' })
  async updateRole(
    @Args('id') id: string,
    @Args('input') input: UpdateRoleInput,
  ): Promise<RoleDataOutput> {
    return { data: await this.roleService.update(id, input) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: 'Soft-delete a role' })
  async deleteRole(@Args('id') id: string): Promise<RoleDataOutput> {
    return { data: await this.roleService.remove(id) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: "Replace a role's permission set" })
  async setRolePermissions(@Args('input') input: SetRolePermissionsInput): Promise<RoleDataOutput> {
    return { data: await this.roleService.setPermissions(input.roleId, input.permissionKeys) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, {
    description: 'Make this the role granted to new self-signups',
  })
  async setDefaultRole(@Args('id') id: string): Promise<RoleDataOutput> {
    return { data: await this.roleService.setDefault(id) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: 'Assign a role to a user' })
  async assignRoleToUser(
    @Args('userId') userId: string,
    @Args('roleId') roleId: string,
  ): Promise<RoleDataOutput> {
    return { data: await this.roleService.assignToUser(userId, roleId) };
  }

  @PoliciesGuard({ permissions: [PermissionKey.ROLE_MANAGE] })
  @Mutation(() => RoleDataOutput, { description: 'Remove a role from a user' })
  async removeRoleFromUser(
    @Args('userId') userId: string,
    @Args('roleId') roleId: string,
  ): Promise<RoleDataOutput> {
    return { data: await this.roleService.removeFromUser(userId, roleId) };
  }
}
