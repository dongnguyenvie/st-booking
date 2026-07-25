import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { createPaginatedOutput, createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class CreateApiKeyInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => [String], { defaultValue: [] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  roleIds?: string[];
}

@ObjectType()
export class ApiKeyOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  /** Raw key value — returned only on creation, masked thereafter */
  @Field({ nullable: true })
  key?: string;

  @Field()
  userId: string;

  @Field(() => [String])
  roleIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const ApiKeyDataOutput = createDataOutput(ApiKeyOutput, 'ApiKeyDataOutput');
export type ApiKeyDataOutput = InstanceType<typeof ApiKeyDataOutput>;

export const ApiKeysPaginatedOutput = createPaginatedOutput(ApiKeyOutput, 'ApiKeysPaginatedOutput');
export type ApiKeysPaginatedOutput = InstanceType<typeof ApiKeysPaginatedOutput>;
