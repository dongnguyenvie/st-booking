import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { User } from '@generated-dto/user/user.model';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class RegisterUserInput {
  @Field()
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;
}

@ObjectType()
export class RegisterUserOutput {
  @Field()
  @ApiProperty()
  accessToken: string;

  @Field(() => User)
  @ApiProperty({ type: () => User })
  user: User;
}

export const RegisterUserDataOutput = createDataOutput(RegisterUserOutput, 'RegisterUserDataOutput');
export type RegisterUserDataOutput = InstanceType<typeof RegisterUserDataOutput>;
