'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Checkbox } from '@repo/ui/components/checkbox';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { Copy, Check } from 'lucide-react';
import { useRoles } from '../../permissions/hooks/use-roles-data';
import type { CreateApiKeyInput, ApiKeyOutput } from '../hooks/use-api-keys-data';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateApiKeyInput) => Promise<ApiKeyOutput>;
}

export function CreateApiKeyDialog({ open, onClose, onCreate }: Props) {
  const { roles, loading: loadingRoles, fetch: fetchRoles } = useRoles();

  const [name, setName] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      fetchRoles();
      setName('');
      setSelectedRoleIds(new Set());
      setError(null);
      setCreatedKey(null);
      setCopied(false);
    }
  }, [open, fetchRoles]);

  function toggleRole(id: string) {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await onCreate({
        name: name.trim(),
        roleIds: selectedRoleIds.size > 0 ? Array.from(selectedRoleIds) : undefined,
      });
      if (result.key) {
        setCreatedKey(result.key);
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.response?.errors?.[0]?.message ?? err?.message ?? 'Failed to create API key');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select input text
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New API Key</DialogTitle>
        </DialogHeader>

        {createdKey ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy your API key now — it will not be shown again.
            </p>
            <div className="space-y-1.5">
              <Label>API Key</Label>
              <div className="flex gap-2">
                <Input readOnly value={createdKey} className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy key">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="key-name">Name *</Label>
              <Input
                id="key-name"
                placeholder="e.g. CI/CD Pipeline Key"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Roles (optional)</Label>
              <ScrollArea className="h-40 rounded border p-3">
                {loadingRoles ? (
                  <p className="text-sm text-muted-foreground">Loading…</p>
                ) : roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No roles available.</p>
                ) : (
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={selectedRoleIds.has(role.id)}
                          onCheckedChange={() => toggleRole(role.id)}
                        />
                        <label htmlFor={`role-${role.id}`} className="cursor-pointer text-sm font-mono">
                          {role.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Key'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
