'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { authA, authS } from '@/store/modules/auth';
import { getHomeRoute } from '@/core/get-home-route-by-privileges';
import { ROUTES } from '@/core/routes';
import { VerifyCodeForm } from './components/verify-code-form';

const SESSION_EXPIRED_KEYWORDS = ['expired', 'invalid', 'not found'];
const LOCKOUT_KEYWORDS = ['too many', 'locked', 'rate'];

function isSessionExpired(msg: string): boolean {
  const lower = msg.toLowerCase();
  return SESSION_EXPIRED_KEYWORDS.some((k) => lower.includes(k));
}

function isLockoutError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return LOCKOUT_KEYWORDS.some((k) => lower.includes(k));
}

export function LoginVerifyPageFeature() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const challenge = useAppSelector(authS.selectTwoFactorChallenge);
  const isAuthenticated = useAppSelector(authS.selectIsAuthenticated);
  const isLoading = useAppSelector(authS.selectLoading);
  const serverError = useAppSelector(authS.selectErrorAfterSubmit);

  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Guard: no challenge AND not yet authenticated → back to login.
  // Skip when authenticated — the verify thunk clears the challenge on success,
  // and the onSuccess callback handles the dashboard redirect.
  useEffect(() => {
    if (challenge === null && !isAuthenticated) {
      router.replace(ROUTES.auth.login);
    }
  }, [challenge, isAuthenticated, router]);

  if (challenge === null) return null;

  const handleSubmit = (code: string) => {
    dispatch(
      authA.verifyTwoFactor(code, challenge.preAuthToken, {
        onSuccess: (user) => {
          const target = getHomeRoute(user ?? { privileges: [] });
          router.push(target);
        },
        onError: (msg) => {
          if (isSessionExpired(msg)) {
            // Pre-auth token expired — clear state, redirect to login
            dispatch(authA.clearTwoFactorChallenge());
            router.replace(ROUTES.auth.login);
            return;
          }
          if (isLockoutError(msg)) {
            setIsLockedOut(true);
          }
        },
      }),
    );
  };

  const handleResend = () => {
    setIsResending(true);
    dispatch(
      authA.resendTwoFactorEmail(challenge.preAuthToken, {
        onSuccess: () => setIsResending(false),
        onError: () => setIsResending(false),
      }),
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <span className="text-2xl font-bold">Carousel Marketplace</span>
        <blockquote className="space-y-2">
          <p className="text-lg italic">"The platform that scales with your team."</p>
        </blockquote>
      </div>

      {/* Right panel — verify form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Two-factor verification</h1>
            <p className="text-sm text-muted-foreground">Additional verification required to sign in.</p>
          </div>

          <VerifyCodeForm
            challenge={challenge}
            isLoading={isLoading}
            serverError={serverError}
            isLockedOut={isLockedOut}
            onSubmit={handleSubmit}
            onResend={handleResend}
            isResending={isResending}
          />
        </div>
      </div>
    </div>
  );
}
