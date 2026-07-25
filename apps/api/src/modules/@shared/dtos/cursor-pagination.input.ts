import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// Cursor (keyset) pagination — forward direction.
// Cursors are opaque, base64url-encoded row ids. UUID v7 is time-sortable, so
// ordering by `id` yields chronological order and `id` is a stable keyset cursor.
@InputType()
export class CursorPaginationInput {
  // Capped at 100 to match the offset-based PaginationInput in this project.
  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  first?: number = 20;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  after?: string;
}
