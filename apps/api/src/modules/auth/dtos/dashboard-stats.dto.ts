import { Field, Int, ObjectType } from '@nestjs/graphql';
import { createDataOutput } from '@modules/@shared/dtos/data-output.factory';

@ObjectType()
export class GetDashboardStatsOutput {
  @Field(() => Int) totalUsers: number;
  @Field(() => Int) activeUsers: number;
  @Field(() => Int) totalRoles: number;
}

export const GetDashboardStatsDataOutput = createDataOutput(
  GetDashboardStatsOutput,
  'GetDashboardStatsDataOutput',
);
export type GetDashboardStatsDataOutput = InstanceType<typeof GetDashboardStatsDataOutput>;
