import { User } from '@generated-dto/user/user.model';
import { createPaginatedOutput } from '@modules/@shared/dtos/data-output.factory';

export const GetUsersOutput = createPaginatedOutput(User, 'GetUsersOutput');
export type GetUsersOutput = InstanceType<typeof GetUsersOutput>;
