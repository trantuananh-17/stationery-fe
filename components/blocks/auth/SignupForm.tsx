'use client';

import { useForm } from 'react-hook-form';

import { handleSignup } from '@/app/[locale]/(marketing)/auth/sign-up/action';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  className?: string;
};

export function SignupForm({ className, ...props }: Props) {
  const router = useRouter();
  const t = useTranslations('RegisterPage');
  const tError = useTranslations('Error');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormValues>();

  const onSubmit = async (values: SignupFormValues) => {
    const normalizedFullName = values.fullName.trim().replace(/\s+/g, ' ');
    const nameParts = normalizedFullName.split(' ');

    if (nameParts.length < 2) {
      setError('fullName', {
        message: t('fullNameInvalid')
      });

      return;
    }

    const lastName = nameParts[0];
    const firstName = nameParts.slice(1).join(' ');

    const result = await handleSignup({
      firstName,
      lastName,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    });

    if (!result.success) {
      toast.error(t('signupFailed'), {
        id: 'signup-failed',
        description: tError(result.message) || result.message,
        position: 'top-right'
      });

      setError('root', {
        message: result.message
      });

      return;
    }

    toast.success(t('signupSuccess'), {
      id: 'signup-success',
      description: t('verifyEmailDescription'),
      position: 'top-right'
    });

    router.replace('/auth/sign-in');
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
            <FieldGroup className='gap-4'>
              <Field>
                <Button variant='outline' type='button'>
                  {t('buttonLoginGoogle')}
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                {t('separator')}
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor='fullName'>{t('fullNameInput')}</FieldLabel>
                <Input
                  id='fullName'
                  type='text'
                  placeholder='Nguyễn Văn Nam'
                  disabled={isSubmitting}
                  {...register('fullName', {
                    required: t('fullNameEmpty')
                  })}
                />
                {errors.fullName && <p className='msg-error text-destructive text-sm'>{errors.fullName.message}</p>}
              </Field>

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
                <FieldLabel htmlFor='password'>{t('passwordInput')}</FieldLabel>
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
                <FieldLabel htmlFor='confirmPassword'>{t('confirmPasswordInput')}</FieldLabel>
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='********'
                  disabled={isSubmitting}
                  {...register('confirmPassword', {
                    required: t('confirmPasswordEmpty'),
                    pattern: {
                      value: passwordRegex,
                      message: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 số'
                    },
                    validate: (value, formValues) => value === formValues.password || t('confirmPasswordNotMatch')
                  })}
                />
                {errors.confirmPassword && (
                  <p className='msg-error text-destructive text-sm'>{errors.confirmPassword.message}</p>
                )}
              </Field>

              {errors.root?.message && (
                <p className='msg-error text-destructive text-center text-sm'>
                  {tError(errors.root.message) || errors.root.message}
                </p>
              )}

              <Field>
                <Button id='btn_submit_register' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? t('loading') || '...' : t('buttonSignup')}
                </Button>

                <FieldDescription className='px-6 text-center'>
                  {t('titleLogin')}
                  <Link href='/auth/sign-in' className='font-medium hover:underline'>
                    {t('buttonLogin')}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
