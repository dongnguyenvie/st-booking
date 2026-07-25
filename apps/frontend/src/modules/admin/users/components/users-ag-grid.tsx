'use client';

import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useEffect, useMemo } from 'react';
import { ShieldCheck, Crown } from 'lucide-react';
import { Privilege } from '@repo/core';
import { useUsersData, type UserListItem } from '../hooks/use-users-data';

// Privileges now carry only SUPER_ADMIN (break-glass); ordinary authority lives
// in roles. Manage a user's roles via the "Manage Roles" dialog.
const PRIVILEGE_CONFIG: Record<number, { label: string; cls: string }> = {
  [Privilege.SUPER_ADMIN]: { label: 'Super Admin', cls: 'bg-red-100 text-red-700' },
};

function PrivilegesCell({ value }: { value: number[] | null | undefined }) {
  const privs = value ?? [];
  if (privs.length === 0) return <span className="text-[10px] text-muted-foreground">—</span>;
  return (
    <div className="flex items-center gap-1">
      {privs.map((p) => {
        const cfg = PRIVILEGE_CONFIG[p];
        if (!cfg) return null;
        return (
          <span key={p} className={`rounded px-1.5 py-px text-[10px] font-semibold leading-4 ${cfg.cls}`}>
            {cfg.label}
          </span>
        );
      })}
    </div>
  );
}

ModuleRegistry.registerModules([AllCommunityModule]);

function StatusCell({ value }: { value: boolean }) {
  const cls = value ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500';
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {value ? 'active' : 'inactive'}
    </span>
  );
}

function DateCell({ value }: { value: string }) {
  return <span>{value ? new Date(value).toLocaleDateString() : '—'}</span>;
}

interface ActionsCellProps extends ICellRendererParams<UserListItem> {
  onManagePolicies?: (user: UserListItem) => void;
  onEditPrivileges?: (user: UserListItem) => void;
}

function ActionsCell({ data, onManagePolicies, onEditPrivileges }: ActionsCellProps) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-1">
      <button
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
        onClick={() => onManagePolicies?.(data)}
        title="Manage Policies"
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Policies
      </button>
      <button
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
        onClick={() => onEditPrivileges?.(data)}
        title="Edit Privileges"
      >
        <Crown className="h-3.5 w-3.5" />
        Privileges
      </button>
    </div>
  );
}

interface UsersAgGridProps {
  onManagePolicies?: (user: UserListItem) => void;
  onEditPrivileges?: (user: UserListItem) => void;
}

export function UsersAgGrid({ onManagePolicies, onEditPrivileges }: UsersAgGridProps) {
  const { items, loading, error, fetch } = useUsersData();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const colDefs = useMemo<ColDef<UserListItem>[]>(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        valueFormatter: (p) => p.value ?? '—',
      },
      { field: 'email', headerName: 'Email', flex: 2.5 },
      {
        field: 'isActive',
        headerName: 'Status',
        flex: 1,
        cellRenderer: StatusCell,
      },
      {
        field: 'privileges',
        headerName: 'Privileges',
        flex: 2,
        cellRenderer: PrivilegesCell,
        sortable: false,
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        flex: 1.5,
        cellRenderer: DateCell,
      },
      {
        headerName: 'Actions',
        flex: 2,
        sortable: false,
        filter: false,
        cellRenderer: ActionsCell,
        cellRendererParams: { onManagePolicies, onEditPrivileges },
      },
    ],
    [onManagePolicies],
  );

  if (error) {
    return (
      <p className="rounded border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
        {error}
      </p>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <AgGridReact<UserListItem>
        rowData={loading ? [] : items}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, filter: true, resizable: true }}
        pagination
        paginationPageSize={10}
        overlayLoadingTemplate='<span class="text-sm text-muted-foreground">Loading users…</span>'
        loading={loading}
      />
    </div>
  );
}
