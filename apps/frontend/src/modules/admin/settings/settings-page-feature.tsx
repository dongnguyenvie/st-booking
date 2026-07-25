'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Switch } from '@repo/ui/components/switch';
import { Separator } from '@repo/ui/components/separator';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { adminSettingsA, adminSettingsS } from '@/store/modules/admin/settings';

export function SettingsPageFeature() {
  const dispatch = useAppDispatch();
  const siteName = useAppSelector(adminSettingsS.selectSiteName);
  const supportEmail = useAppSelector(adminSettingsS.selectSupportEmail);
  const emailNotifications = useAppSelector(adminSettingsS.selectEmailNotifications);
  const maintenanceMode = useAppSelector(adminSettingsS.selectMaintenanceMode);
  const twoFactorRequired = useAppSelector(adminSettingsS.selectTwoFactorRequired);

  const set = <K extends 'siteName' | 'supportEmail' | 'emailNotifications' | 'maintenanceMode' | 'twoFactorRequired'>(
    key: K,
  ) => (value: string | boolean) =>
    dispatch(adminSettingsA.setField({ key, value } as never));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage application-wide configuration.</p>
      </div>

      {/* General */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={siteName}
              onChange={(e) => set('siteName')(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(e) => set('supportEmail')(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">Send system alerts via email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={set('emailNotifications')} />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require 2FA</p>
              <p className="text-xs text-muted-foreground">Enforce two-factor authentication for all users</p>
            </div>
            <Switch checked={twoFactorRequired} onCheckedChange={set('twoFactorRequired')} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">Temporarily disable access for non-admin users</p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={set('maintenanceMode')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
