import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

const CACHE_TTL_SECONDS = 300; // 5 minutes
const CACHE_KEY = (id: string) => `role:${id}`;

export interface CachedRole {
  id: string;
  name: string;
  /** Flattened `resource:verb` permission keys this role grants. */
  permissions: string[];
}

@Injectable()
export class RoleCacheService {
  private readonly logger = new Logger(RoleCacheService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /** Load roles by IDs — serves from Redis cache, falls back to DB. */
  async loadByIds(ids: string[]): Promise<CachedRole[]> {
    if (!ids.length) return [];
    const results = await Promise.all(ids.map((id) => this.loadOne(id)));
    return results.filter((r): r is CachedRole => r !== null);
  }

  /** Flattened set of permission keys granted by the given roles. */
  async permissionsFor(ids: string[]): Promise<Set<string>> {
    const roles = await this.loadByIds(ids);
    return new Set(roles.flatMap((r) => r.permissions));
  }

  /** Invalidate a cached role — call after editing a role or its permissions. */
  async invalidate(id: string): Promise<void> {
    await this.redis.del(CACHE_KEY(id));
  }

  private async loadOne(id: string): Promise<CachedRole | null> {
    try {
      const cached = await this.redis.getJson<CachedRole>(CACHE_KEY(id));
      if (cached) return cached;

      const role = await this.prisma.role.findFirst({
        where: { id, deletedAt: null },
        select: {
          id: true,
          name: true,
          rolePermissions: { select: { permission: { select: { key: true } } } },
        },
      });
      if (!role) return null;

      const value: CachedRole = {
        id: role.id,
        name: role.name,
        permissions: role.rolePermissions.map((rp) => rp.permission.key),
      };
      await this.redis.setJson(CACHE_KEY(id), value, CACHE_TTL_SECONDS);
      return value;
    } catch (err) {
      this.logger.warn(`Failed to load role ${id}: ${err?.message}`);
      return null;
    }
  }
}
