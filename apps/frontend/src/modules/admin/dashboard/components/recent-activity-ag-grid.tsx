'use client';

import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useMemo } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

interface ActivityRow {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
}

const MOCK_DATA: ActivityRow[] = [
  {
    id: '1',
    user: 'alice@carousel-marketplace.io',
    action: 'LOGIN',
    resource: 'Auth',
    timestamp: '2026-04-08 12:01',
    status: 'success',
  },
  {
    id: '2',
    user: 'bob@carousel-marketplace.io',
    action: 'CREATE',
    resource: 'User',
    timestamp: '2026-04-08 11:55',
    status: 'success',
  },
  {
    id: '3',
    user: 'carol@carousel-marketplace.io',
    action: 'DELETE',
    resource: 'Order #482',
    timestamp: '2026-04-08 11:43',
    status: 'failed',
  },
  {
    id: '4',
    user: 'dave@carousel-marketplace.io',
    action: 'UPDATE',
    resource: 'Settings',
    timestamp: '2026-04-08 11:30',
    status: 'pending',
  },
  {
    id: '5',
    user: 'eve@carousel-marketplace.io',
    action: 'EXPORT',
    resource: 'Report',
    timestamp: '2026-04-08 11:12',
    status: 'success',
  },
];

const statusColors: Record<ActivityRow['status'], string> = {
  success: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  pending: 'text-yellow-600 bg-yellow-50',
};

function StatusCell({ value }: { value: ActivityRow['status'] }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[value]}`}>
      {value}
    </span>
  );
}

export function RecentActivityAgGrid() {
  const colDefs = useMemo<ColDef<ActivityRow>[]>(
    () => [
      { field: 'user', headerName: 'User', flex: 2 },
      { field: 'action', headerName: 'Action', flex: 1 },
      { field: 'resource', headerName: 'Resource', flex: 2 },
      { field: 'timestamp', headerName: 'Time', flex: 1.5 },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        cellRenderer: StatusCell,
      },
    ],
    [],
  );

  return (
    <div className="h-72 w-full">
      <AgGridReact<ActivityRow>
        rowData={MOCK_DATA}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, filter: true, resizable: true }}
      />
    </div>
  );
}
