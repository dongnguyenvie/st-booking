import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

/** Relay-style page info for cursor (keyset) pagination */
@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
}

/** Creates a GraphQL ObjectType that wraps an array in { data: T[], pageInfo } */
export function createCursorOutput<T>(ItemClass: Type<T>, typeName: string) {
  @ObjectType(typeName)
  class CursorWrapper {
    @Field(() => [ItemClass])
    data: T[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }
  return CursorWrapper;
}
