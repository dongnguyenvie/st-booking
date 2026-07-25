'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Separator } from '@repo/ui/components/separator';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import Link from 'next/link';
import { authA, authS } from '@/store/modules/auth';
import { ROUTES } from '@/core/routes';
import { getHomeRoute } from '@/core/get-home-route-by-privileges';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loginWithRedirect } = useAuth0();
  const isLoading = useAppSelector(authS.selectLoading);
  const serverError = useAppSelector(authS.selectErrorAfterSubmit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    dispatch(
      authA.signIn(
        { email: values.email, password: values.password },
        {
          onSuccess: (user) => {
            const target = getHomeRoute(user ?? { privileges: [] });
            router.push(target);
          },
          onTwoFactorRequired: () => {
            router.push(ROUTES.auth.loginVerify);
          },
        },
      ),
    );
  };

  const handleAuth0Login = () => {
    // Redirect to Auth0 Universal Login; callback lands at /auth/callback
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}${ROUTES.auth.callback}`,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email / password fields */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>

      {/* Auth0 Universal Login */}
      <div className="relative my-2">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
          or
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={handleAuth0Login}
      >
        Continue with Auth0
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.auth.register} className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
