import { Field, ObjectType } from '@nestjs/graphql';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

/** The authenticated user's role names and flattened `resource:verb` permissions. */
@ObjectType()
export class MyAccessOutput {
  @Field(() => [String]) roles: string[];
  @Field(() => [String]) permissions: string[];
}

export const MyAccessDataOutput = createDataOutput(MyAccessOutput, 'MyAccessDataOutput');
export type MyAccessDataOutput = InstanceType<typeof MyAccessDataOutput>;
