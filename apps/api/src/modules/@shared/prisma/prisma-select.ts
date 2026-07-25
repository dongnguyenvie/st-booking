import { Prisma } from '@core/prisma';
import { PrismaSelect as PalPrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';

/**
 * Wraps @paljs/plugins PrismaSelect to build a Prisma `select` object
 * from GraphQL resolver info — only fetches fields requested by the client.
 *
 * Usage in resolver:
 *   const { select } = new PrismaSelect(info).valueOf('data', 'User');
 *   return this.prisma.user.findMany({ where, ...select });
 *
 * For flat queries (no nested `data` wrapper):
 *   const { select } = new PrismaSelect(info).valueOf('', 'User');
 */
export class PrismaSelect {
  private $select: PalPrismaSelect;

  constructor(info: GraphQLResolveInfo) {
    // Prisma.dmmf was removed in v7 — @paljs/plugins v9 works without it
    this.$select = new PalPrismaSelect(info);
  }

  valueOf(field: string, filterBy?: Prisma.ModelName, mergeObject?: Record<string, any>) {
    return this.$select.valueOf(field, filterBy, mergeObject);
  }
}
