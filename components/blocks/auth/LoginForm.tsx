'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { handleLogin } from '@/app/(marketing)/auth/sign-in/action';
import { getUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';

type LoginFormValues = {
  email: string;
  password: string;
};

type Props = {
  className?: string;
};

export function LoginForm({ className, ...props }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormValues>();

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      const result = await handleLogin(values);

      if (!result.success) {
        setError('root', {
          message: result.message
        });
        return;
      }

      setAuth({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
        user: result.data.profile.data
      });

      await queryClient.invalidateQueries({
        queryKey: ['profile']
      });

      const role = result.data.profile.data.role;

      // if (role === 'ADMIN') {
      //   router.replace('/admin/dashboard');
      //   return;
      // }

      router.replace('/');
      router.refresh();
    });
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button variant='outline' type='button'>
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  disabled={isPending}
                  {...register('email', {
                    required: 'Email không được để trống'
                  })}
                />
                {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  disabled={isPending}
                  {...register('password', {
                    required: 'Password không được để trống'
                  })}
                />
                {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
              </Field>

              <Field>
                {errors.root && <p className='text-destructive text-center text-sm'>{errors.root.message}</p>}
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Đang đăng nhập...' : 'Login'}
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account? <a href='/auth/sign-up'>Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
