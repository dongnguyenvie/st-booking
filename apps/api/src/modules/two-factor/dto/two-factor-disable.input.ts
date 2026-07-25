import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class TwoFactorDisableInput {
  /** Current account password — always required */
  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * OTP code — required for TOTP method.
   * v1 simplification: ignored when method=EMAIL (password alone is sufficient).
   */
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  code?: string;
}
