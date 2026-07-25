'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { ShieldOff, ShieldCheck, Loader2 } from 'lucide-react';
import { TwoFactorMethod } from '@/api-service/generated/graphql.generated';
import type { DisableStep } from '../hooks/use-two-factor-setup';

interface DisableTwoFactorCardProps {
  method: TwoFactorMethod;
  step: DisableStep;
  error: string | null;
  onDisable: (password: string, code?: string) => void;
  onReset: () => void;
}

export function DisableTwoFactorCard({ method, step, error, onDisable, onReset }: DisableTwoFactorCardProps) {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [open, setOpen] = useState(false);

  const isTOTP = method === TwoFactorMethod.TOTP;
  const canSubmit = password.length >= 6 && (!isTOTP || code.length === 6);

  const handleSubmit = () => {
    if (canSubmit) onDisable(password, isTOTP ? code : undefined);
  };

  if (step === 'success') {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <ShieldCheck className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium">Two-factor authentication disabled.</p>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldOff className="h-5 w-5 text-destructive" />
          <CardTitle className="text-base">Disable Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Currently enabled via{' '}
          <strong>{method === TwoFactorMethod.TOTP ? 'Authenticator App' : 'Email OTP'}</strong>. Enter your
          password{isTOTP ? ' and a current TOTP code' : ''} to disable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!open ? (
          <Button variant="destructive" onClick={() => setOpen(true)}>
            Disable 2FA
          </Button>
        ) : (
          <>
            <Input
              type="password"
              placeholder="Current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={step === 'submitting'}
            />
            {isTOTP && (
              <Input
                placeholder="6-digit TOTP code"
                maxLength={6}
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                disabled={step === 'submitting'}
              />
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={!canSubmit || step === 'submitting'}
                className="flex-1"
              >
                {step === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Disable'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setPassword('');
                  setCode('');
                }}
                disabled={step === 'submitting'}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
