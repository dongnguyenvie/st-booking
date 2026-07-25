'use client';

import { useEffect } from 'react';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import { KeyRound, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { apiKeysA, apiKeysS } from '@/store/modules/admin/api-keys';
import { useApiKeys } from './hooks/use-api-keys-data';
import { CreateApiKeyDialog } from './components/create-api-key-dialog';
import type { CreateApiKeyInput } from './hooks/use-api-keys-data';

export function ApiKeysSection() {
  const { items, loading, error, fetch, create, remove } = useApiKeys();
  const dispatch = useAppDispatch();
  const dialogOpen = useAppSelector(apiKeysS.selectCreateDialogOpen);
  const deleteError = useAppSelector(apiKeysS.selectDeleteError);

  useEffect(() => {
    fetch();
    return () => {
      dispatch(apiKeysA.reset());
    };
  }, [fetch, dispatch]);

  async function handleCreate(input: CreateApiKeyInput) {
    return create(input);
  }

  async function handleDelete(id: string) {
    dispatch(apiKeysA.setDeleteError(null));
    try {
      await remove(id);
    } catch (err: any) {
      dispatch(
        apiKeysA.setDeleteError(
          err?.response?.errors?.[0]?.message ?? err?.message ?? 'Failed to delete key',
        ),
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Create and manage API keys for programmatic access.</p>
        </div>
        <Button onClick={() => dispatch(apiKeysA.openCreateDialog())}>
          <Plus className="mr-2 h-4 w-4" />
          New API Key
        </Button>
      </div>

      {(error || deleteError) && (
        <p className="rounded border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error ?? deleteError}
        </p>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
          <KeyRound className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">No API keys yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first key for programmatic access.</p>
          <Button className="mt-4" onClick={() => dispatch(apiKeysA.openCreateDialog())}>
            <Plus className="mr-2 h-4 w-4" />
            New API Key
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Key</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Policies</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((apiKey) => (
                <tr key={apiKey.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{apiKey.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{'••••••••••••'}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{apiKey.roleIds.length} roles</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(apiKey.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(apiKey.id)}
                      aria-label={`Delete ${apiKey.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateApiKeyDialog open={dialogOpen} onClose={() => dispatch(apiKeysA.closeCreateDialog())} onCreate={handleCreate} />
    </div>
  );
}
