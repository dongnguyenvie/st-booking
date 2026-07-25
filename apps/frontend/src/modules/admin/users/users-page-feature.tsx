'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { usersA, usersS } from '@/store/modules/admin/users';
import { UsersAgGrid } from './components/users-ag-grid';
import { UserRolesDialog } from './components/user-roles-dialog';
import { UserPrivilegesDialog } from './components/user-privileges-dialog';

export function UsersPageFeature() {
  const dispatch = useAppDispatch();
  const policiesUser = useAppSelector(usersS.selectPoliciesUser);
  const privilegesUser = useAppSelector(usersS.selectPrivilegesUser);
  const policiesOpen = useAppSelector(usersS.selectPoliciesDialogOpen);
  const privilegesOpen = useAppSelector(usersS.selectPrivilegesDialogOpen);
  const refreshKey = useAppSelector(usersS.selectRefreshKey);

  useEffect(() => {
    return () => {
      dispatch(usersA.reset());
    };
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage system users and their roles.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Keyed on refreshKey so a privilege change remounts and refetches. */}
          <UsersAgGrid
            key={refreshKey}
            onManagePolicies={(u) => dispatch(usersA.openPoliciesDialog(u))}
            onEditPrivileges={(u) => dispatch(usersA.openPrivilegesDialog(u))}
          />
        </CardContent>
      </Card>

      <UserRolesDialog
        open={policiesOpen}
        user={policiesUser}
        onClose={() => dispatch(usersA.closeDialogs())}
      />
      <UserPrivilegesDialog
        open={privilegesOpen}
        user={privilegesUser}
        onClose={() => dispatch(usersA.closeDialogs())}
        onUpdated={() => dispatch(usersA.refresh())}
      />
    </div>
  );
}
