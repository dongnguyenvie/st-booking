import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Role } from '../role/role.model';
import { User } from '../user/user.model';
import { BusinessCount } from './business-count.output';

@ObjectType()
export class Business {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:true})
    legalName!: string | null;

    @Field(() => String, {nullable:true})
    tradeName!: string | null;

    @Field(() => String, {nullable:true})
    addressLine1!: string | null;

    @Field(() => String, {nullable:true})
    addressLine2!: string | null;

    @Field(() => String, {nullable:true})
    city!: string | null;

    @Field(() => String, {nullable:true})
    state!: string | null;

    @Field(() => String, {nullable:true})
    postalCode!: string | null;

    @Field(() => String, {nullable:true})
    country!: string | null;

    @Field(() => String, {nullable:true})
    phone!: string | null;

    @Field(() => String, {nullable:true})
    fax!: string | null;

    @Field(() => String, {nullable:true})
    email!: string | null;

    @Field(() => String, {nullable:true})
    website!: string | null;

    @Field(() => String, {nullable:true})
    taxIdLabel!: string | null;

    @Field(() => String, {nullable:true})
    taxIdNumber!: string | null;

    @Field(() => String, {nullable:true})
    defaultPaymentTerms!: string | null;

    @Field(() => String, {nullable:true})
    invoiceFooterNote!: string | null;

    @Field(() => [Role], {nullable:true})
    roles?: Array<Role>;

    @Field(() => [User], {nullable:true})
    users?: Array<User>;

    @Field(() => BusinessCount, {nullable:false})
    _count?: BusinessCount;
}
