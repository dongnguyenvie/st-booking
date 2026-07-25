'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@repo/ui/components/button';
import { Checkbox } from '@repo/ui/components/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui/components/alert-dialog';
import { ShieldPlus, Pencil, Trash2 } from 'lucide-react';
import { permissionsA, permissionsS } from '@/store/modules/admin/permissions';
import type { RoleItem } from '@/store/modules/admin/permissions/permissions-types';
import type { AppDispatch } from '@/store/store';
import { RoleDialog, type RoleFormValue } from './components/role-dialog';

export function PermissionsPageFeature() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(permissionsS.selectLoading);
  const roles = useSelector(permissionsS.selectRoles);
  const catalog = useSelector(permissionsS.selectPermissionCatalog);
  const error = useSelector(permissionsS.selectError);
  const createDialogOpen = useSelector(permissionsS.selectCreateDialogOpen);
  const editingRole = useSelector(permissionsS.selectEditingRole);

  const [roleToDelete, setRoleToDelete] = useState<RoleItem | null>(null);

  useEffect(() => {
    dispatch(permissionsA.init());
    return () => {
      dispatch(permissionsA.destroy());
    };
  }, [dispatch]);

  // permission catalog grouped by resource, sorted for a stable matrix.
  const grouped = useMemo(() => {
    const map = new Map<string, typeof catalog>();
    for (const p of [...catalog].sort((a, b) => a.action.localeCompare(b.action))) {
      const list = map.get(p.resource) ?? [];
      list.push(p);
      map.set(p.resource, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [catalog]);

  // role.id -> Set(permission keys it grants), for O(1) cell lookups.
  const roleKeys = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const r of roles) {
      m.set(r.id, new Set((r.rolePermissions ?? []).map((rp) => rp.permission.key)));
    }
    return m;
  }, [roles]);

  function toggle(role: RoleItem, permKey: string, has: boolean) {
    const current = [...(roleKeys.get(role.id) ?? new Set<string>())];
    const next = has ? current.filter((k) => k !== permKey) : [...current, permKey];
    dispatch(permissionsA.setRolePermissions(role.id, next));
  }

  function handleCreate(value: RoleFormValue) {
    dispatch(permissionsA.createRole(value, { onSuccess: () => dispatch(permissionsA.closeDialog()) }));
  }

  function handleUpdate(id: string, value: RoleFormValue) {
    dispatch(permissionsA.updateRole(id, value, { onSuccess: () => dispatch(permissionsA.closeDialog()) }));
  }

  const cellBase = 'border-b border-border px-3 py-2 text-sm';
  const stickyCol = 'sticky left-0 z-10 bg-card';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Roles &amp; Permissions</h1>
          <p className="text-muted-foreground">
            Tick a cell to grant a permission to a role. Columns are roles, rows are permissions.
          </p>
        </div>
        <Button onClick={() => dispatch(permissionsA.openCreateDialog())}>
          <ShieldPlus className="mr-2 h-4 w-4" />
          New Role
        </Button>
      </div>

      {error && (
        <p className="rounded border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading && roles.length === 0 ? (
        <div className="h-64 animate-pulse rounded-lg border bg-muted/30" />
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border py-12 text-center">
          <ShieldPlus className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium">No roles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first role to start assigning permissions.</p>
          <Button className="mt-4" onClick={() => dispatch(permissionsA.openCreateDialog())}>
            <ShieldPlus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className={`${cellBase} ${stickyCol} bg-muted/40 text-left font-semibold min-w-[16rem]`}>
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role.id} className={`${cellBase} min-w-[9rem] text-center align-top`}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-mono font-semibold">{role.name}</span>
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {roleKeys.get(role.id)?.size ?? 0} perms
                      </span>
                      {role.isDefault ? (
                        <span
                          className="rounded bg-primary/10 px-1.5 py-px text-[10px] font-medium text-primary"
                          title="New self-signups get this role"
                        >
                          signup default
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded px-1.5 py-px text-[10px] font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => dispatch(permissionsA.setDefaultRole(role.id))}
                          title="Make new self-signups get this role"
                        >
                          set as signup default
                        </button>
                      )}
                      <div className="flex items-center gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => dispatch(permissionsA.openEditDialog(role))}
                          aria-label={`Rename ${role.name}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => setRoleToDelete(role)}
                          aria-label={`Delete ${role.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grouped.map(([resource, perms]) => (
                <FragmentGroup key={resource} resource={resource} colSpan={roles.length + 1}>
                  {perms.map((perm) => (
                    <tr key={perm.key} className="hover:bg-muted/20">
                      <td className={`${cellBase} ${stickyCol}`}>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs">{perm.key}</span>
                          {perm.description && (
                            <span className="text-[11px] text-muted-foreground">{perm.description}</span>
                          )}
                        </div>
                      </td>
                      {roles.map((role) => {
                        const has = roleKeys.get(role.id)?.has(perm.key) ?? false;
                        return (
                          <td key={role.id} className={`${cellBase} text-center`}>
                            <Checkbox
                              checked={has}
                              onCheckedChange={() => toggle(role, perm.key, has)}
                              aria-label={`${has ? 'Revoke' : 'Grant'} ${perm.key} for ${role.name}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </FragmentGroup>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RoleDialog
        open={createDialogOpen}
        onClose={() => dispatch(permissionsA.closeDialog())}
        onCreate={handleCreate}
        role={editingRole ?? undefined}
        onUpdate={handleUpdate}
      />

      <AlertDialog open={!!roleToDelete} onOpenChange={(v) => !v && setRoleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role “{roleToDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the role and its permission assignments. Users lose whatever access it granted.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (roleToDelete) dispatch(permissionsA.deleteRole(roleToDelete.id));
                setRoleToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** A resource sub-header row followed by its permission rows. */
function FragmentGroup({
  resource,
  colSpan,
  children,
}: {
  resource: string;
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={colSpan}
          className="sticky left-0 bg-muted/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {resource}
        </td>
      </tr>
      {children}
    </>
  );
}
