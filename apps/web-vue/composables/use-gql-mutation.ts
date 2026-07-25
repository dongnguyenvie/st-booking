import { useMutation } from 'villus';
import { ref } from 'vue';

/**
 * Thin wrapper around villus useMutation.
 * Provides unified loading/error reactive state and a typed execute helper.
 */
export function useGqlMutation<TData = unknown, TVars = Record<string, unknown>>(document: string) {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { execute: villusExecute } = useMutation<TData>(document);

  async function execute(variables?: TVars): Promise<TData | null> {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: gqlError } = await villusExecute(variables as Record<string, unknown>);
      if (gqlError) {
        error.value = gqlError.message;
        return null;
      }
      return data ?? null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unexpected error';
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { execute, loading, error };
}
