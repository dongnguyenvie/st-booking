import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyInput, ApiKeyDataOutput, ApiKeysPaginatedOutput } from './dtos/api-key.dto';
import { PoliciesGuard } from '@core/guards/policies.guard';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { PaginationInput } from '@modules/@shared/dtos/pagination.input';

@Resolver()
export class ApiKeyResolver {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @PoliciesGuard()
  @Query(() => ApiKeysPaginatedOutput, { description: 'Get my API keys' })
  async getMyApiKeys(
    @CurrentUser() user: { id: string },
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<ApiKeysPaginatedOutput> {
    return this.apiKeyService.findByUser(user.id, pagination);
  }

  @PoliciesGuard()
  @Mutation(() => ApiKeyDataOutput, {
    description: 'Create an API key for the current user',
  })
  async createApiKey(
    @Args('input') input: CreateApiKeyInput,
    @CurrentUser() user: { id: string },
  ): Promise<ApiKeyDataOutput> {
    return { data: await this.apiKeyService.create(user.id, input, user.id) };
  }

  @PoliciesGuard()
  @Mutation(() => ApiKeyDataOutput, {
    description: 'Delete (soft-delete) an API key',
  })
  async deleteApiKey(@Args('id') id: string, @CurrentUser() user: { id: string }): Promise<ApiKeyDataOutput> {
    return { data: await this.apiKeyService.delete(id, user.id) };
  }
}
