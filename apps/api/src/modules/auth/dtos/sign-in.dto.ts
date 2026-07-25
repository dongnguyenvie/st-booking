import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '@generated-dto/user/user.model';
import { TwoFactorMethod } from '@repo/core';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class SignInInput {
  @Field()
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

/**
 * Single sign-in output shape — backward compatible.
 * If twoFactorRequired=true: preAuthToken + twoFactorMethod are set; accessToken/user are null.
 * If twoFactorRequired=false: accessToken + user are set (legacy shape).
 */
@ObjectType()
export class SignInOutput {
  @Field(() => String, { nullable: true })
  @ApiPropertyOptional()
  accessToken?: string | null;

  @Field(() => User, { nullable: true })
  @ApiPropertyOptional({ type: () => User })
  user?: User | null;

  @Field(() => Boolean, { defaultValue: false })
  @ApiProperty({ default: false })
  twoFactorRequired: boolean;

  @Field(() => String, { nullable: true })
  @ApiPropertyOptional()
  preAuthToken?: string | null;

  @Field(() => TwoFactorMethod, { nullable: true })
  @ApiPropertyOptional({ enum: TwoFactorMethod })
  twoFactorMethod?: TwoFactorMethod | null;
}

export const SignInDataOutput = createDataOutput(SignInOutput, 'SignInDataOutput');
export type SignInDataOutput = InstanceType<typeof SignInDataOutput>;
