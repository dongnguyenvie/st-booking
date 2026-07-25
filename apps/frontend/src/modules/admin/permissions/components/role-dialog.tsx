'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import type { RoleItem } from '@/store/modules/admin/permissions/permissions-types';

export interface RoleFormValue {
  name: string;
  description?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (value: RoleFormValue) => void | Promise<void>;
  role?: RoleItem;
  onUpdate?: (id: string, value: RoleFormValue) => void | Promise<void>;
}

/**
 * Create / rename a role. Permission assignment happens in the matrix on the
 * page — this dialog only owns identity (name + description).
 */
export function RoleDialog({ open, onClose, onCreate, role, onUpdate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && role) {
      setName(role.name);
      setDescription(role.description ?? '');
    } else if (open && !role) {
      setName('');
      setDescription('');
    }
    setError(null);
  }, [open, role]);

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const value: RoleFormValue = {
        name: name.trim(),
        description: description.trim() || undefined,
      };
      if (role && onUpdate) await onUpdate(role.id, value);
      else await onCreate(value);
      onClose();
    } catch (err: any) {
      setError(err?.response?.errors?.[0]?.message ?? err?.message ?? 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  }

  const isEditMode = !!role;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Role' : 'New Role'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">Name *</Label>
            <Input
              id="role-name"
              placeholder="e.g. lender_operator"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role-desc">Description</Label>
            <Input
              id="role-desc"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {isEditMode && (
            <p className="text-xs text-muted-foreground">
              Assign permissions in the matrix after saving.
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting
              ? isEditMode
                ? 'Saving…'
                : 'Creating…'
              : isEditMode
                ? 'Save Changes'
                : 'Create Role'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
