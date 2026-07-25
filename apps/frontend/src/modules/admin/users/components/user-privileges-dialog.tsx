'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Badge } from '@repo/ui/components/badge';
import { toast } from 'sonner';
import { Privilege } from '@repo/core';
import { updateUserPrivileges } from '@/api-service/mutations/update-user-privileges';
import type { UserListItem } from '../hooks/use-users-data';

// Privileges now carry only SUPER_ADMIN (a break-glass bypass). All ordinary
// authority (borrower / lender / admin) is granted through roles — use the
// "Manage Roles" dialog for that.
const PRIVILEGE_OPTIONS = [
  {
    value: Privilege.SUPER_ADMIN,
    label: 'Super Admin',
    description: 'Break-glass: full system access, bypasses RBAC',
    tier: 'admin',
  },
] as const;

interface Props {
  open: boolean;
  user: UserListItem | null;
  onClose: () => void;
  onUpdated: () => void;
}

export function UserPrivilegesDialog({ open, user, onClose, onUpdated }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && user) {
      setSelected(new Set(user.privileges ?? []));
    }
  }, [open, user]);

  function toggle(value: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  async function handleSave() {
    if (!user) return;
    setSubmitting(true);
    try {
      await updateUserPrivileges({ userId: user.id, privileges: Array.from(selected) });
      toast.success('Privileges updated', { description: `Updated privileges for ${user.email}` });
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error('Failed to update', { description: err?.message ?? 'Unknown error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Privileges</DialogTitle>
          {user && <p className="text-sm text-muted-foreground">{user.email}</p>}
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Privileges carry only the break-glass Super Admin flag. Grant ordinary borrower / lender /
            admin authority through <span className="font-medium">Manage Roles</span> instead.
          </p>
          <div className="space-y-2">
            {PRIVILEGE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={selected.has(opt.value)}
                  onCheckedChange={() => toggle(opt.value)}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{opt.label}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {opt.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Privileges'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
