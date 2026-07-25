'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Badge } from '@repo/ui/components/badge';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { X, Plus } from 'lucide-react';
import { useUserRoles, useRoles } from '../../permissions/hooks/use-roles-data';

interface Props {
  open: boolean;
  user: { id: string; email: string; name?: string | null } | null;
  onClose: () => void;
}

export function UserRolesDialog({ open, user, onClose }: Props) {
  const {
    roles: userRoles,
    loading: loadingUserRoles,
    error: userRolesError,
    fetch: fetchUserRoles,
    assign,
    remove,
  } = useUserRoles(user?.id ?? '');

  const { roles: allRoles, loading: loadingAll, fetch: fetchAll } = useRoles();

  useEffect(() => {
    if (open && user?.id) {
      fetchUserRoles();
      fetchAll();
    }
  }, [open, user?.id, fetchUserRoles, fetchAll]);

  const assignedIds = new Set(userRoles.map((r) => r.id));
  const availableRoles = allRoles.filter((r) => !assignedIds.has(r.id));

  if (!user) return null;

  const permCount = (role: { rolePermissions?: { permission: { key: string } }[] | null }) =>
    role.rolePermissions?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Manage Roles — {user.email}</DialogTitle>
        </DialogHeader>

        {userRolesError && (
          <p className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {userRolesError}
          </p>
        )}

        <Tabs defaultValue="assigned">
          <TabsList className="w-full">
            <TabsTrigger value="assigned" className="flex-1">
              Assigned ({userRoles.length})
            </TabsTrigger>
            <TabsTrigger value="available" className="flex-1">
              Available ({availableRoles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned">
            <ScrollArea className="h-72 rounded border">
              {loadingUserRoles ? (
                <p className="p-4 text-sm text-muted-foreground">Loading…</p>
              ) : userRoles.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No roles assigned yet.</p>
              ) : (
                <ul className="divide-y">
                  {userRoles.map((role) => (
                    <li key={role.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium font-mono">{role.name}</p>
                        {role.description && (
                          <p className="truncate text-xs text-muted-foreground">{role.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-[10px]">
                          {permCount(role)} perms
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => remove(role.id)}
                          aria-label={`Remove ${role.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="available">
            <ScrollArea className="h-72 rounded border">
              {loadingAll ? (
                <p className="p-4 text-sm text-muted-foreground">Loading…</p>
              ) : availableRoles.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">All roles are already assigned.</p>
              ) : (
                <ul className="divide-y">
                  {availableRoles.map((role) => (
                    <li key={role.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium font-mono">{role.name}</p>
                        {role.description && (
                          <p className="truncate text-xs text-muted-foreground">{role.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-[10px]">
                          {permCount(role)} perms
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-primary hover:text-primary"
                          onClick={() => assign(role.id)}
                          aria-label={`Add ${role.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
