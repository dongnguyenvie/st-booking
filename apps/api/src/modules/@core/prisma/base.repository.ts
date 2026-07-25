import { NotFoundException } from '@nestjs/common';
import { CursorPaginationInput } from '@modules/@shared/dtos/cursor-pagination.input';
import { buildCursorResult, CursorPaginatedResult, toCursorQuery } from '@core/utils/cursor.util';

export interface BaseWhere {
  deletedAt?: Date | null;
  id?: string;
  [key: string]: unknown;
}

/**
 * The structural subset of a Prisma model delegate that BaseRepository uses.
 * A concrete repository exposes its `prisma.<model>` delegate as this shape
 * (a single documented cast, since Prisma's generated delegate types are wider).
 */
export interface BaseDelegate<Entity> {
  findFirst(args: { where?: BaseWhere }): Promise<Entity | null>;
  findMany(args: {
    where?: BaseWhere;
    take?: number;
    skip?: number;
    cursor?: { id: string };
    orderBy?: unknown;
  }): Promise<Entity[]>;
  findUniqueOrThrow(args: { where: { id: string } }): Promise<Entity>;
  create(args: { data: Record<string, unknown> }): Promise<Entity>;
  updateMany(args: { where: BaseWhere; data: Record<string, unknown> }): Promise<{ count: number }>;
}

/**
 * Shared data access: every read/write excludes soft-deleted rows, and deletes
 * are status changes. Concrete repositories provide the Prisma delegate and add
 * model-specific queries on top.
 *
 * NOTE: the upstream version of this class (cleanover-v3) also scoped every
 * query by `businessId` pulled from a CLS TenantContextService. That service is
 * not part of this project, so scoping is intentionally omitted here — a
 * subclass that needs tenant isolation should override `scopedWhere` to fold in
 * its own businessId rather than reintroducing CLS globally.
 */
export abstract class BaseRepository<Entity extends { id: string }> {
  /** The Prisma model delegate, e.g. `this.prisma.user`. */
  protected abstract get delegate(): BaseDelegate<Entity>;

  /** where excluding soft-deleted rows. Override to add scoping. */
  protected scopedWhere(where: BaseWhere = {}): BaseWhere {
    return { ...where, deletedAt: null };
  }

  findById(id: string): Promise<Entity | null> {
    return this.delegate.findFirst({ where: this.scopedWhere({ id }) });
  }

  async list(input?: CursorPaginationInput): Promise<CursorPaginatedResult<Entity>> {
    const rows = await this.delegate.findMany({
      ...toCursorQuery(input),
      where: this.scopedWhere(),
      orderBy: { id: 'asc' },
    });
    return buildCursorResult(rows, input);
  }

  protected create(data: object): Promise<Entity> {
    return this.delegate.create({ data: { ...data } as Record<string, unknown> });
  }

  protected async update(id: string, data: object): Promise<Entity> {
    const res = await this.delegate.updateMany({
      where: this.scopedWhere({ id }),
      data: { ...data } as Record<string, unknown>,
    });
    if (res.count === 0) throw new NotFoundException('Record not found');
    return this.delegate.findUniqueOrThrow({ where: { id } });
  }

  async softDelete(id: string): Promise<Entity> {
    const res = await this.delegate.updateMany({
      where: this.scopedWhere({ id }),
      data: { deletedAt: new Date() },
    });
    if (res.count === 0) throw new NotFoundException('Record not found');
    return this.delegate.findUniqueOrThrow({ where: { id } });
  }
}
