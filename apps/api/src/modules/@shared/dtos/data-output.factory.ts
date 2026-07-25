import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

/** Pagination metadata for list responses */
@ObjectType()
export class MetaOutput {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

/** Creates a GraphQL ObjectType that wraps a single item in { data: T } */
export function createDataOutput<T>(ItemClass: Type<T>, typeName: string) {
  @ObjectType(typeName)
  class DataWrapper {
    @Field(() => ItemClass)
    data: T;
  }
  return DataWrapper;
}

/** Creates a GraphQL ObjectType that wraps an array in { data: T[], meta } */
export function createPaginatedOutput<T>(ItemClass: Type<T>, typeName: string) {
  @ObjectType(typeName)
  class PaginatedWrapper {
    @Field(() => [ItemClass])
    data: T[];

    @Field(() => MetaOutput)
    meta: MetaOutput;
  }
  return PaginatedWrapper;
}
