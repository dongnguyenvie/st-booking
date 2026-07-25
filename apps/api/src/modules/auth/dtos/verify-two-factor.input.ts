import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { User } from '@generated-dto/user/user.model';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class VerifyTwoFactorInput {
  @Field()
  @ApiProperty({ description: 'Short-lived pre-auth token from signIn response' })
  @IsString()
  preAuthToken: string;

  @Field()
  @ApiProperty({ description: 'TOTP code or email OTP code' })
  @IsString()
  @MinLength(4)
  code: string;
}

@ObjectType()
export class VerifyTwoFactorOutput {
  @Field()
  @ApiProperty()
  accessToken: string;

  @Field(() => User)
  @ApiProperty({ type: () => User })
  user: User;
}

export const VerifyTwoFactorDataOutput = createDataOutput(VerifyTwoFactorOutput, 'VerifyTwoFactorDataOutput');
export type VerifyTwoFactorDataOutput = InstanceType<typeof VerifyTwoFactorDataOutput>;
