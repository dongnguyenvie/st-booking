// Cursor (keyset) pagination helpers, shared across feature modules.
//
// UUID v7 primary keys are time-sortable, so `ORDER BY id` == chronological
// order and `id` is a stable, opaque cursor. These helpers lean on Prisma's
// native `cursor` + `skip: 1` (a keyset seek under the hood) instead of OFFSET.
import { BadRequestException } from '@nestjs/common';
import { CursorPaginationInput } from '@modules/@shared/dtos/cursor-pagination.input';

const DEFAULT_FIRST = 20;

export interface CursorPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  pageInfo: CursorPageInfo;
}

/** Prisma `findMany` params derived from a cursor input */
export interface CursorQueryParams {
  take: number; // first + 1 — the extra row detects hasNextPage
  cursor?: { id: string };
  skip?: number; // 1 when a cursor is given, to skip the cursor row itself
}

export function encodeCursor(id: string): string {
  return Buffer.from(id, 'utf8').toString('base64url');
}

export function decodeCursor(cursor: string): string {
  const id = Buffer.from(cursor, 'base64url').toString('utf8');
  if (!id) {
    throw new BadRequestException('Invalid cursor');
  }
  return id;
}

/**
 * Turn the GraphQL input into Prisma `findMany` params.
 * Spread the result into the query, e.g.:
 *   prisma.user.findMany({ ...toCursorQuery(input), where, orderBy: { id: 'asc' } })
 */
export function toCursorQuery(input?: CursorPaginationInput): CursorQueryParams {
  const first = input?.first ?? DEFAULT_FIRST;
  const after = input?.after;
  return {
    take: first + 1,
    ...(after ? { cursor: { id: decodeCursor(after) }, skip: 1 } : {}),
  };
}

/**
 * Build the paginated result from rows fetched with `take = first + 1`.
 * The extra row (if present) is dropped and flags hasNextPage.
 */
export function buildCursorResult<T extends { id: string }>(
  rows: T[],
  input?: CursorPaginationInput,
): CursorPaginatedResult<T> {
  const first = input?.first ?? DEFAULT_FIRST;
  const hasNextPage = rows.length > first;
  const data = hasNextPage ? rows.slice(0, first) : rows;
  const firstRow = data[0];
  const lastRow = data[data.length - 1];
  return {
    data,
    pageInfo: {
      hasNextPage,
      // Forward-only: a previous page exists iff we navigated from a cursor.
      hasPreviousPage: Boolean(input?.after),
      startCursor: firstRow ? encodeCursor(firstRow.id) : null,
      endCursor: lastRow ? encodeCursor(lastRow.id) : null,
    },
  };
}
