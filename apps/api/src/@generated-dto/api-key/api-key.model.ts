import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { ApiKeyRole } from '../api-key-role/api-key-role.model';
import { ApiKeyCount } from './api-key-count.output';

@ObjectType()
export class ApiKey {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    key!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    userId!: string;

    @Field(() => String, {nullable:true})
    createdByUserId!: string | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Date, {nullable:true})
    deletedAt!: Date | null;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => User, {nullable:true})
    createdByUser?: User | null;

    @Field(() => [ApiKeyRole], {nullable:true})
    roles?: Array<ApiKeyRole>;

    @Field(() => ApiKeyCount, {nullable:false})
    _count?: ApiKeyCount;
}
