'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { handleLogin } from '@/app/[locale]/(marketing)/auth/sign-in/action';
import { getUser } from '@/lib/auth';
import { Link, useRouter } from '@/i18n/routing';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type LoginFormValues = {
  email: string;
  password: string;
};

type Props = {
  className?: string;
};

export function LoginForm({ className, ...props }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const t = useTranslations('LoginPage');
  const tError = useTranslations('Error');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    const result = await handleLogin(values);

    if (!result.success) {
      toast.error(t('loginFailed'), {
        description: tError(result.message) || result.message,
        position: 'top-right',
        id: 'login-failed'
      });

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

    const fullName = [result.data.profile.data.firstName, result.data.profile.data.lastName].filter(Boolean).join(' ');

    toast.success(t('loginSuccess'), {
      description: t('welcomeBackDescription', { fullName }),
      position: 'top-center',
      id: 'login-success'
    });

    await queryClient.invalidateQueries({
      queryKey: ['profile']
    });

    const role = result.data.profile.data.role;

    if (role === 'ADMIN') {
      router.replace('/admin/dashboard');
      return;
    }

    router.replace('/');
    router.refresh();
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>{t('title')}</CardTitle>
          <CardDescription>{t('subTitle')}</CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <Button variant='outline' type='button'>
                  {t('buttonLoginGoogle')}
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                {t('separator')}
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  disabled={isSubmitting}
                  {...register('email', {
                    required: t('emailEmpty'),
                    pattern: {
                      value: emailRegex,
                      message: 'Email không đúng định dạng'
                    }
                  })}
                />
                {errors.email && <p className='msg-error text-destructive text-sm'>{errors.email.message}</p>}
              </Field>

              <Field>
                <FieldLabel htmlFor='password'>{t('password')}</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  placeholder='********'
                  disabled={isSubmitting}
                  {...register('password', {
                    required: t('passwordEmpty'),
                    pattern: {
                      value: passwordRegex,
                      message: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
                    }
                  })}
                />
                {errors.password && <p className='msg-error text-destructive text-sm'>{errors.password.message}</p>}
              </Field>

              <Field>
                {errors.root?.message && (
                  <p className='msg-error text-destructive text-center text-sm'>{tError(errors.root.message)}</p>
                )}
                <Button id='btn_submit_login' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Đang đăng nhập...' : `${t('buttonLogin')}`}
                </Button>
                <FieldDescription className='text-center'>
                  {t('titleRegister')} <Link href='/auth/sign-up'>{t('buttonRegister')}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
