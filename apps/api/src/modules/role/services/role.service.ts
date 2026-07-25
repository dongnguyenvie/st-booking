import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { RoleCacheService } from '@core/services/role-cache.service';
import { CreateRoleInput, UpdateRoleInput } from '../dtos/role.dto';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: RoleCacheService,
  ) {}

  async create(input: CreateRoleInput, createdByUserId?: string) {
    const role = await this.prisma.role.create({
      data: {
        name: input.name,
        description: input.description,
        businessId: input.businessId,
        createdByUserId,
      },
    });
    if (input.permissionKeys?.length) {
      await this.setPermissions(role.id, input.permissionKeys);
    }
    return this.findOne(role.id);
  }

  async findAll(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        include: { rolePermissions: { include: { permission: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.role.count({ where }),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, deletedAt: null },
      include: { rolePermissions: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
    return role;
  }

  async update(id: string, input: UpdateRoleInput) {
    await this.ensureExists(id);
    await this.prisma.role.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });
    await this.cache.invalidate(id);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    const role = await this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.cache.invalidate(id);
    return role;
  }

  /** Replace a role's permission set with the given `resource:verb` keys. */
  async setPermissions(roleId: string, permissionKeys: string[]) {
    await this.ensureExists(roleId);

    const permissions = await this.prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
      select: { id: true, key: true },
    });

    const missing = permissionKeys.filter((k) => !permissions.some((p) => p.key === k));
    if (missing.length) {
      throw new BadRequestException(`Unknown permission(s): ${missing.join(', ')}`);
    }

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId } }),
      this.prisma.rolePermission.createMany({
        data: permissions.map((p) => ({ roleId, permissionId: p.id })),
        skipDuplicates: true,
      }),
    ]);
    await this.cache.invalidate(roleId);
    return this.findOne(roleId);
  }

  /**
   * Make `roleId` the role granted to new self-signups.
   *
   * Runs as one transaction that clears the flag everywhere else first, so the
   * "exactly one default" invariant holds without a partial unique index
   * (which Prisma cannot express and would read as schema drift).
   */
  async setDefault(roleId: string) {
    await this.ensureExists(roleId);
    await this.prisma.$transaction([
      this.prisma.role.updateMany({
        where: { isDefault: true, NOT: { id: roleId } },
        data: { isDefault: false },
      }),
      this.prisma.role.update({ where: { id: roleId }, data: { isDefault: true } }),
    ]);
    await this.cache.invalidate(roleId);
    return this.findOne(roleId);
  }

  async listPermissions(pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 100;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        orderBy: [{ resource: 'asc' }, { action: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.permission.count(),
    ]);
    return { data, meta: { total, page, limit } };
  }

  async assignToUser(userId: string, roleId: string) {
    await this.ensureExists(roleId);
    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      create: { userId, roleId },
      update: {},
    });
    return this.findOne(roleId);
  }

  async removeFromUser(userId: string, roleId: string) {
    await this.prisma.userRole.deleteMany({ where: { userId, roleId } });
    return this.findOne(roleId);
  }

  async findByUser(userId: string, pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.prisma.userRole.findMany({
        where: { userId, role: { deletedAt: null } },
        include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.userRole.count({ where: { userId, role: { deletedAt: null } } }),
    ]);
    return { data: rows.map((r) => r.role), meta: { total, page, limit } };
  }

  private async ensureExists(id: string) {
    const role = await this.prisma.role.findFirst({ where: { id, deletedAt: null } });
    if (!role) throw new NotFoundException(`Role ${id} not found`);
  }
}
