import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
export class UserCount {

    @Field(() => Int, {nullable:false})
    userRoles?: number;

    @Field(() => Int, {nullable:false})
    apiKeys?: number;

    @Field(() => Int, {nullable:false})
    createdApiKeys?: number;

    @Field(() => Int, {nullable:false})
    twoFactorChallenges?: number;
}
