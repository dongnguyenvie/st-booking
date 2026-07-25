import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { TwoFactorMethod } from '@repo/core';
import { Int } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class TwoFactorChallenge {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    userId!: string;

    @Field(() => TwoFactorMethod, {nullable:false})
    method!: string;

    @Field(() => String, {nullable:false})
    codeHash!: string;

    @Field(() => Int, {defaultValue:0,nullable:false})
    attempts!: number;

    @Field(() => Date, {nullable:false})
    expiresAt!: Date;

    @Field(() => Date, {nullable:true})
    consumedAt!: Date | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => User, {nullable:false})
    user?: User;
}
