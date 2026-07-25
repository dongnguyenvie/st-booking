import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Role } from '../role/role.model';
import { Permission } from '../permission/permission.model';

@ObjectType()
export class RolePermission {

    @Field(() => String, {nullable:false})
    roleId!: string;

    @Field(() => String, {nullable:false})
    permissionId!: string;

    @Field(() => Role, {nullable:false})
    role?: Role;

    @Field(() => Permission, {nullable:false})
    permission?: Permission;
}
