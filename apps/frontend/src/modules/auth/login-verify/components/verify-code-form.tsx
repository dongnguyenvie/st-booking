'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import type { TwoFactorChallenge } from '@/store/modules/auth/auth-types';
import { TwoFactorMethod } from '@/api-service/generated/graphql.generated';

const verifySchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d{6}$/, 'Code must be numeric'),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

interface VerifyCodeFormProps {
  challenge: TwoFactorChallenge;
  isLoading: boolean;
  serverError: string | null;
  isLockedOut: boolean;
  onSubmit: (code: string) => void;
  onResend: () => void;
  isResending: boolean;
}

export function VerifyCodeForm({
  challenge,
  isLoading,
  serverError,
  isLockedOut,
  onSubmit,
  onResend,
  isResending,
}: VerifyCodeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const disabled = isSubmitting || isLoading || isLockedOut;

  const handleFormSubmit = (values: VerifyFormValues) => {
    onSubmit(values.code);
  };

  const methodLabel =
    challenge.method === TwoFactorMethod.TOTP
      ? 'Enter the 6-digit code from your authenticator app'
      : `Enter the 6-digit code sent to ${challenge.email}`;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <p className="text-sm text-muted-foreground">{methodLabel}</p>

      <div className="space-y-1">
        <label htmlFor="code" className="text-sm font-medium">
          Verification code
        </label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          disabled={disabled}
          autoComplete="one-time-code"
          className="tracking-[0.5em] text-center text-lg"
          {...register('code')}
        />
        {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      {isLockedOut && (
        <p className="text-sm text-destructive font-medium">
          Too many failed attempts. Please wait and try again.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={disabled}>
        {isSubmitting || isLoading ? 'Verifying…' : 'Verify'}
      </Button>

      {challenge.method === TwoFactorMethod.EMAIL && (
        <div className="text-center">
          <button
            type="button"
            onClick={onResend}
            disabled={isResending || isLockedOut}
            className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? 'Sending…' : 'Resend code'}
          </button>
        </div>
      )}
    </form>
  );
}
