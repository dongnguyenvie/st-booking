import { Field, ObjectType } from '@nestjs/graphql';

/** Generic success/failure result for 2FA mutations. */
@ObjectType()
export class TwoFactorResultOutput {
  @Field()
  success: boolean;
}
