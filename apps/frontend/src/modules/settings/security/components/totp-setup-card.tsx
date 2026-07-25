'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import type { SetupStep } from '../hooks/use-two-factor-setup';

interface TotpSetupCardProps {
  step: SetupStep;
  qrDataUrl: string | null;
  secret: string | null;
  error: string | null;
  onStart: () => void;
  onVerify: (code: string) => void;
  onReset: () => void;
}

export function TotpSetupCard({
  step,
  qrDataUrl,
  secret,
  error,
  onStart,
  onVerify,
  onReset,
}: TotpSetupCardProps) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length === 6) onVerify(code);
  };

  if (step === 'success') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium">Authenticator app enabled!</p>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Set up again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          <CardTitle className="text-base">Authenticator App (TOTP)</CardTitle>
        </div>
        <CardDescription>Use an app like Google Authenticator or Authy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'idle' && (
          <Button onClick={onStart} className="w-full">
            Enable Authenticator App
          </Button>
        )}

        {step === 'initializing' && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating QR code…
          </div>
        )}

        {(step === 'show-qr' || step === 'verifying') && (
          <div className="space-y-4">
            {qrDataUrl && (
              <div className="flex justify-center">
                <img src={qrDataUrl} alt="TOTP QR code" className="h-40 w-40 rounded border" />
              </div>
            )}
            {secret && (
              <div className="rounded-md bg-muted px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground mb-1">Manual entry key</p>
                <code className="text-xs font-mono break-all">{secret}</code>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Enter the 6-digit code from your app:</p>
              <Input
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                disabled={step === 'verifying'}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button
                onClick={handleVerify}
                disabled={code.length !== 6 || step === 'verifying'}
                className="flex-1"
              >
                {step === 'verifying' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Enable'}
              </Button>
              <Button variant="outline" onClick={onReset} disabled={step === 'verifying'}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
