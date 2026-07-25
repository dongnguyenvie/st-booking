'use client';

import {
  useGetMyApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
} from '@/api-service/generated/graphql-hooks.generated';
import type {
  ApiKeyOutput,
  CreateApiKeyInput,
  PaginationInput,
} from '@/api-service/generated/graphql.generated';

export type { ApiKeyOutput, CreateApiKeyInput };

export function useApiKeys(pagination?: PaginationInput) {
  const { data, isLoading, error, refetch } = useGetMyApiKeysQuery({
    pagination,
  });
  const { mutateAsync: createAsync } = useCreateApiKeyMutation();
  const { mutateAsync: deleteAsync } = useDeleteApiKeyMutation();

  const create = async (input: CreateApiKeyInput): Promise<ApiKeyOutput> => {
    const result = await createAsync({ input });
    await refetch();
    return result.createApiKey.data;
  };

  const remove = async (id: string): Promise<void> => {
    await deleteAsync({ id });
    await refetch();
  };

  return {
    items: data?.getMyApiKeys.data ?? [],
    meta: data?.getMyApiKeys.meta ?? { total: 0, page: 1, limit: 20 },
    loading: isLoading,
    error: error ? ((error as any)?.response?.errors?.[0]?.message ?? (error as Error).message) : null,
    fetch: refetch,
    create,
    remove,
  };
}
