'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import type { SetupStep } from '../hooks/use-two-factor-setup';

interface EmailSetupCardProps {
  step: SetupStep;
  error: string | null;
  onStart: () => void;
  onVerify: (code: string) => void;
  onReset: () => void;
}

export function EmailSetupCard({ step, error, onStart, onVerify, onReset }: EmailSetupCardProps) {
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length === 6) onVerify(code);
  };

  if (step === 'success') {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium">Email OTP enabled!</p>
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
          <Mail className="h-5 w-5" />
          <CardTitle className="text-base">Email OTP</CardTitle>
        </div>
        <CardDescription>Receive a one-time code via email each time you sign in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'idle' && (
          <Button onClick={onStart} variant="outline" className="w-full">
            Enable Email OTP
          </Button>
        )}

        {step === 'initializing' && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending code…
          </div>
        )}

        {(step === 'show-email-input' || step === 'verifying') && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A 6-digit code was sent to your email address. Check your inbox (or console in dev).
            </p>
            <div className="space-y-2">
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
