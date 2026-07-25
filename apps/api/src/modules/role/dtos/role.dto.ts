import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { Role } from '@generated-dto/role/role.model';
import { Permission } from '@generated-dto/permission/permission.model';
import { createDataOutput, createPaginatedOutput } from '@modules/@shared/dtos/data-output.factory';

@InputType()
export class CreateRoleInput {
  @Field()
  @ApiProperty({ example: 'lender_operator' })
  @IsString()
  name: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Lender desk operator' })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => [String], { defaultValue: [] })
  @ApiProperty({ type: [String], example: ['offer:post', 'stip:approve'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionKeys?: string[];

  @Field({ nullable: true })
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  businessId?: string;
}

@InputType()
export class UpdateRoleInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class SetRolePermissionsInput {
  @Field()
  @IsUUID()
  roleId: string;

  @Field(() => [String], { defaultValue: [] })
  @ApiProperty({ type: [String], example: ['offer:post', 'stip:approve'] })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}

export const RoleDataOutput = createDataOutput(Role, 'RoleDataOutput');
export type RoleDataOutput = InstanceType<typeof RoleDataOutput>;

export const RolesPaginatedOutput = createPaginatedOutput(Role, 'RolesPaginatedOutput');
export type RolesPaginatedOutput = InstanceType<typeof RolesPaginatedOutput>;

export const PermissionsPaginatedOutput = createPaginatedOutput(
  Permission,
  'PermissionsPaginatedOutput',
);
export type PermissionsPaginatedOutput = InstanceType<typeof PermissionsPaginatedOutput>;
