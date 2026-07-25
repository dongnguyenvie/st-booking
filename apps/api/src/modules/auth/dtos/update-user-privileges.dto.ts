import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { User } from '@generated-dto/user/user.model';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class UpdateUserPrivilegesInput {
  @Field()
  @IsString()
  userId: string;

  @Field(() => [Int])
  @IsArray()
  privileges: number[];
}

export const UpdateUserPrivilegesDataOutput = createDataOutput(User, 'UpdateUserPrivilegesDataOutput');
export type UpdateUserPrivilegesDataOutput = InstanceType<typeof UpdateUserPrivilegesDataOutput>;
