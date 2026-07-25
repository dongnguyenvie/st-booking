import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class ResendTwoFactorEmailInput {
  @Field()
  @ApiProperty({ description: 'Short-lived pre-auth token from signIn response' })
  @IsString()
  preAuthToken: string;
}

@ObjectType()
export class ResendTwoFactorEmailOutput {
  @Field()
  @ApiProperty()
  sent: boolean;
}
