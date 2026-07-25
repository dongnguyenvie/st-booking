'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authSliceActions } from '@/store/modules/auth/auth-slice';
import { authSelectors } from '@/store/modules/auth/auth-selectors';
import { useMeQuery } from '@/api-service/generated/graphql-hooks.generated';
import { TotpSetupCard } from './components/totp-setup-card';
import { EmailSetupCard } from './components/email-setup-card';
import { DisableTwoFactorCard } from './components/disable-two-factor-card';
import { useTwoFactorSetup } from './hooks/use-two-factor-setup';
import { TwoFactorMethod } from '@/api-service/generated/graphql.generated';
import { ShieldCheck } from 'lucide-react';

export function SecurityPageFeature() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(authSelectors.selectUser);

  // Fetch fresh me data on mount to ensure 2FA status is current
  const { data: meData } = useMeQuery();

  useEffect(() => {
    if (meData?.me) {
      dispatch(
        authSliceActions.updateUser({
          twoFactorEnabled: meData.me.twoFactorEnabled,
          twoFactorMethod: meData.me.twoFactorMethod as TwoFactorMethod | null,
        }),
      );
    }
  }, [meData, dispatch]);

  // Prefer server-fresh data; fall back to Redux while loading
  const twoFactorEnabled = meData?.me?.twoFactorEnabled ?? user?.twoFactorEnabled ?? false;
  const twoFactorMethod = (meData?.me?.twoFactorMethod ?? user?.twoFactorMethod) as TwoFactorMethod | null;

  const {
    setupStep,
    qrDataUrl,
    secret,
    setupError,
    disableStep,
    disableError,
    startSetup,
    verifySetup,
    disable,
    resetSetup,
    resetDisable,
  } = useTwoFactorSetup();

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8 px-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Security</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage two-factor authentication for your account.</p>
      </div>

      {twoFactorEnabled && twoFactorMethod ? (
        <DisableTwoFactorCard
          method={twoFactorMethod}
          step={disableStep}
          error={disableError}
          onDisable={(password, code) => disable(password, code)}
          onReset={resetDisable}
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium">Choose a two-factor method to enable:</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TotpSetupCard
              step={setupStep}
              qrDataUrl={qrDataUrl}
              secret={secret}
              error={setupError}
              onStart={() => startSetup(TwoFactorMethod.TOTP)}
              onVerify={(code) => verifySetup(TwoFactorMethod.TOTP, code)}
              onReset={resetSetup}
            />
            <EmailSetupCard
              step={setupStep}
              error={setupError}
              onStart={() => startSetup(TwoFactorMethod.EMAIL)}
              onVerify={(code) => verifySetup(TwoFactorMethod.EMAIL, code)}
              onReset={resetSetup}
            />
          </div>
        </div>
      )}
    </div>
  );
}
