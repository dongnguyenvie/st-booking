import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';
import { User } from '@generated-dto/user/user.model';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class SignInByAuth0Input {
  @Field()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

@ObjectType()
export class SignInByAuth0Output {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

export const SignInByAuth0DataOutput = createDataOutput(SignInByAuth0Output, 'SignInByAuth0DataOutput');
export type SignInByAuth0DataOutput = InstanceType<typeof SignInByAuth0DataOutput>;
