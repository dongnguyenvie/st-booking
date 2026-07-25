import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { TwoFactorMethod } from '@repo/core';

@InputType()
export class TwoFactorSetupVerifyInput {
  @Field(() => TwoFactorMethod)
  @IsEnum(TwoFactorMethod)
  method: TwoFactorMethod;

  /** 6-digit OTP code (TOTP or email) */
  @Field()
  @IsString()
  @Length(6, 6)
  code: string;
}
