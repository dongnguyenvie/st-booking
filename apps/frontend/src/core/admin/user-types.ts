import type { GetUsersQuery } from '@/api-service/generated/graphql.generated';

/**
 * One row of the admin user list, derived from the generated GraphQL types.
 *
 * Lives in core/ rather than inside the users module because the users store
 * module needs it too, and store/ may not import from modules/.
 */
export type UserListItem = GetUsersQuery['getUsers']['data'][number];
