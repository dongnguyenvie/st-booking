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
import { authA, authS } from '@/store/modules/auth';
import { ROUTES } from '@/core/routes';
import { getHomeRoute } from '@/core/get-home-route-by-privileges';
import Link from 'next/link';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loginWithRedirect } = useAuth0();
  const isLoading = useAppSelector(authS.selectLoading);
  const serverError = useAppSelector(authS.selectErrorAfterSubmit);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch(
      authA.register(
        { email: values.email, password: values.password, name: values.name },
        {
          onSuccess: (user) => {
            const target = getHomeRoute(user ?? { privileges: [] });
            router.push(target);
          },
        },
      ),
    );
  };

  const handleAuth0Login = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}${ROUTES.auth.callback}`,
        screen_hint: 'signup',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input id="name" placeholder="John Doe" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

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

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting || isLoading}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

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
        Sign up with Auth0
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={ROUTES.auth.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
