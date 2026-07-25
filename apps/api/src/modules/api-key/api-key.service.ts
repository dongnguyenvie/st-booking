import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '@core/prisma/prisma.service';
import { CreateApiKeyInput, ApiKeyOutput } from './dtos/api-key.dto';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, input: CreateApiKeyInput, createdByUserId?: string): Promise<ApiKeyOutput> {
    const rawKey = `sk_live_${randomBytes(32).toString('hex')}`;

    const record = await this.prisma.apiKey.create({
      data: {
        key: rawKey,
        name: input.name,
        userId,
        createdByUserId,
        ...(input.roleIds?.length && {
          roles: {
            create: input.roleIds.map((id) => ({ roleId: id })),
          },
        }),
      },
      include: { roles: true },
    });

    return this.toDto(record, rawKey);
  }

  async findByUser(userId: string, pagination?: PaginationInput) {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { userId, deletedAt: null };
    const [records, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        where,
        include: { roles: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.apiKey.count({ where }),
    ]);
    return {
      data: records.map((r) => this.toDto(r)),
      meta: { total, page, limit },
    };
  }

  async delete(id: string, userId: string): Promise<ApiKeyOutput> {
    const record = await this.prisma.apiKey.findFirst({
      where: { id, userId, deletedAt: null },
    });
    if (!record) throw new NotFoundException(`ApiKey ${id} not found`);

    const deleted = await this.prisma.apiKey.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { roles: true },
    });
    return this.toDto(deleted);
  }

  private toDto(record: any, rawKey?: string): ApiKeyOutput {
    return {
      id: record.id,
      name: record.name,
      ...(rawKey !== undefined && { key: rawKey }),
      userId: record.userId,
      roleIds: record.roles?.map((r: any) => r.roleId) ?? [],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
