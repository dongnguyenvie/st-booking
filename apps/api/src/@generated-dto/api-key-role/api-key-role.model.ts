import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ApiKey } from '../api-key/api-key.model';
import { Role } from '../role/role.model';

@ObjectType()
export class ApiKeyRole {

    @Field(() => String, {nullable:false})
    apiKeyId!: string;

    @Field(() => String, {nullable:false})
    roleId!: string;

    @Field(() => ApiKey, {nullable:false})
    apiKey?: ApiKey;

    @Field(() => Role, {nullable:false})
    role?: Role;
}
