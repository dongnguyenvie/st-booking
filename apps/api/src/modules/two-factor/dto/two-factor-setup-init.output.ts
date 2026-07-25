import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Output for twoFactorSetupInit mutation.
 * TOTP: returns secret + qrCodeDataUrl.
 * EMAIL: returns challengeId.
 */
@ObjectType()
export class TwoFactorSetupInitOutput {
  /** Base32 TOTP secret — only for TOTP method */
  @Field({ nullable: true })
  secret?: string;

  /** QR code data URL for authenticator app — only for TOTP method */
  @Field({ nullable: true })
  qrCodeDataUrl?: string;

  /** Challenge row ID for OTP verification — only for EMAIL method */
  @Field({ nullable: true })
  challengeId?: string;
}
