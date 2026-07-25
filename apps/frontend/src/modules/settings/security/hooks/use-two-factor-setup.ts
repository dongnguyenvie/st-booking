'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authSliceActions } from '@/store/modules/auth/auth-slice';
import { securityA, securityS } from '@/store/modules/settings/security';
import {
  useTwoFactorSetupInitMutation,
  useTwoFactorSetupVerifyMutation,
  useTwoFactorDisableMutation,
  useMeQuery,
} from '@/api-service/generated/graphql-hooks.generated';
import { TwoFactorMethod } from '@/api-service/generated/graphql.generated';

export type { SetupStep, DisableStep } from '@/core/settings/two-factor-types';

function extractError(err: unknown): string {
  const e = err as { response?: { errors?: { message: string }[] }; message?: string };
  return e?.response?.errors?.[0]?.message ?? e?.message ?? 'Unknown error';
}

/**
 * 2FA setup/disable logic. The state machine lives in the security store
 * module so the page owns it like every other page in the app; this hook is
 * the orchestration around it.
 */
export function useTwoFactorSetup() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const setupStep = useAppSelector(securityS.selectSetupStep);
  const disableStep = useAppSelector(securityS.selectDisableStep);
  const qrDataUrl = useAppSelector(securityS.selectQrDataUrl);
  const secret = useAppSelector(securityS.selectSecret);
  const setupError = useAppSelector(securityS.selectSetupError);
  const disableError = useAppSelector(securityS.selectDisableError);

  // ── refetch me and sync to Redux ──────────────────────────────────────────
  const refreshMe = useCallback(async () => {
    try {
      const data = await useMeQuery.fetcher()();
      const me = data.me;
      if (me) {
        dispatch(
          authSliceActions.updateUser({
            twoFactorEnabled: me.twoFactorEnabled,
            twoFactorMethod: me.twoFactorMethod as TwoFactorMethod | null,
          }),
        );
      }
      // Invalidate TanStack Query cache for me
      queryClient.invalidateQueries({ queryKey: useMeQuery.getKey() });
    } catch (_) {
      // Non-critical — UI already updated via Redux
    }
  }, [dispatch, queryClient]);

  // ── setup init ────────────────────────────────────────────────────────────
  const startSetup = useCallback(async (method: TwoFactorMethod) => {
    dispatch(securityA.setSetupError(null));
    dispatch(securityA.setSetupStep('initializing'));
    try {
      const data = await useTwoFactorSetupInitMutation.fetcher({ method })();
      const result = data.twoFactorSetupInit;
      if (method === TwoFactorMethod.TOTP) {
        dispatch(
          securityA.setEnrolment({
            qrDataUrl: result.qrCodeDataUrl ?? null,
            secret: result.secret ?? null,
          }),
        );
        dispatch(securityA.setSetupStep('show-qr'));
      } else {
        dispatch(securityA.setSetupStep('show-email-input'));
      }
    } catch (err) {
      dispatch(securityA.setSetupError(extractError(err)));
      dispatch(securityA.setSetupStep('idle'));
    }
  }, []);

  // ── setup verify ──────────────────────────────────────────────────────────
  const verifySetup = useCallback(
    async (method: TwoFactorMethod, code: string) => {
      dispatch(securityA.setSetupError(null));
      dispatch(securityA.setSetupStep('verifying'));
      try {
        await useTwoFactorSetupVerifyMutation.fetcher({ input: { method, code } })();
        dispatch(securityA.setSetupStep('success'));
        await refreshMe();
      } catch (err) {
        dispatch(securityA.setSetupError(extractError(err)));
        dispatch(securityA.setSetupStep(method === TwoFactorMethod.TOTP ? 'show-qr' : 'show-email-input'));
      }
    },
    [refreshMe],
  );

  // ── disable ───────────────────────────────────────────────────────────────
  const disable = useCallback(
    async (password: string, code?: string) => {
      dispatch(securityA.setDisableError(null));
      dispatch(securityA.setDisableStep('submitting'));
      try {
        await useTwoFactorDisableMutation.fetcher({ input: { password, code } })();
        dispatch(securityA.setDisableStep('success'));
        await refreshMe();
      } catch (err) {
        dispatch(securityA.setDisableError(extractError(err)));
        dispatch(securityA.setDisableStep('idle'));
      }
    },
    [refreshMe],
  );

  const resetSetup = useCallback(() => {
    dispatch(securityA.setSetupStep('idle'));
    dispatch(securityA.setEnrolment({ qrDataUrl: null, secret: null }));
    dispatch(securityA.setSetupError(null));
  }, []);

  const resetDisable = useCallback(() => {
    dispatch(securityA.setDisableStep('idle'));
    dispatch(securityA.setDisableError(null));
  }, []);

  return {
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
  };
}
