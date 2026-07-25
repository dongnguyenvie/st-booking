import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { TwoFactorMethod } from '@repo/core';
import { Business } from '../business/business.model';
import { UserRole } from '../user-role/user-role.model';
import { ApiKey } from '../api-key/api-key.model';
import { TwoFactorChallenge } from '../two-factor-challenge/two-factor-challenge.model';
import { UserCount } from './user-count.output';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:true})
    phone!: string | null;

    @HideField()
    password!: string | null;

    @Field(() => String, {nullable:true})
    name!: string | null;

    @HideField()
    auth0Id!: string | null;

    @Field(() => String, {nullable:true})
    kycStatus!: string | null;

    @Field(() => [Int], {nullable:true})
    privileges!: Array<number>;

    @Field(() => Boolean, {defaultValue:true,nullable:false})
    isActive!: boolean;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Date, {nullable:true})
    deletedAt!: Date | null;

    @Field(() => Boolean, {defaultValue:false,nullable:false})
    twoFactorEnabled!: boolean;

    @Field(() => TwoFactorMethod, {nullable:true})
    twoFactorMethod!: string | null;

    @HideField()
    twoFactorSecret!: string | null;

    @Field(() => Date, {nullable:true})
    twoFactorEnabledAt!: Date | null;

    @Field(() => String, {nullable:true})
    businessId!: string | null;

    @Field(() => Business, {nullable:true})
    business?: Business | null;

    @Field(() => [UserRole], {nullable:true})
    userRoles?: Array<UserRole>;

    @Field(() => [ApiKey], {nullable:true})
    apiKeys?: Array<ApiKey>;

    @Field(() => [ApiKey], {nullable:true})
    createdApiKeys?: Array<ApiKey>;

    @Field(() => [TwoFactorChallenge], {nullable:true})
    twoFactorChallenges?: Array<TwoFactorChallenge>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
