import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { HideField } from '@nestjs/graphql';
import { RolePermission } from '../role-permission/role-permission.model';
import { UserRole } from '../user-role/user-role.model';
import { ApiKeyRole } from '../api-key-role/api-key-role.model';
import { Business } from '../business/business.model';
import { RoleCount } from './role-count.output';

@ObjectType()
export class Role {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    /**
     * Role granted to new self-signups. Exactly one role should carry this —
     * enforced in RoleService.setDefault (a transaction that clears the rest),
     * since Prisma cannot express a partial unique index.
     */
    @Field(() => Boolean, {defaultValue:false,description:'Role granted to new self-signups. Exactly one role should carry this —\nenforced in RoleService.setDefault (a transaction that clears the rest),\nsince Prisma cannot express a partial unique index.',nullable:false})
    isDefault!: boolean;

    @Field(() => String, {nullable:true})
    businessId!: string | null;

    @HideField()
    deletedAt!: Date | null;

    @HideField()
    deletedByUserId!: string | null;

    @Field(() => String, {nullable:true})
    createdByUserId!: string | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [RolePermission], {nullable:true})
    rolePermissions?: Array<RolePermission>;

    @Field(() => [UserRole], {nullable:true})
    userRoles?: Array<UserRole>;

    @Field(() => [ApiKeyRole], {nullable:true})
    apiKeys?: Array<ApiKeyRole>;

    @Field(() => Business, {nullable:true})
    business?: Business | null;

    @Field(() => RoleCount, {nullable:false})
    _count?: RoleCount;
}
