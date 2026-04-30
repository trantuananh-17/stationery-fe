'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { handleSignup } from '@/app/(marketing)/auth/sign-up/action';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type Props = {
  className?: string;
};

export function SignupForm({ className, ...props }: Props) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignupFormValues>();

  const onSubmit = (values: SignupFormValues) => {
    startTransition(async () => {
      const result = await handleSignup(values);

      if (!result.success) {
        setError('root', {
          message: result.message
        });

        return;
      }

      console.log(result);
    });
  };

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Create an account</CardTitle>
          <CardDescription>Enter your information below to create your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='gap-4'>
              <Field>
                <Button variant='outline' type='button'>
                  Sign up with Google
                </Button>
              </Field>

              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Or continue with
              </FieldSeparator>

              <div className='grid grid-cols-2 gap-2'>
                <Field>
                  <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='John'
                    disabled={isPending}
                    {...register('firstName', {
                      required: 'First name không được để trống'
                    })}
                  />
                  {errors.firstName && <p className='text-destructive text-sm'>{errors.firstName.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Doe'
                    disabled={isPending}
                    {...register('lastName', {
                      required: 'Last name không được để trống'
                    })}
                  />
                  {errors.lastName && <p className='text-destructive text-sm'>{errors.lastName.message}</p>}
                </Field>
              </div>

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
                <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
                <Input
                  id='confirmPassword'
                  type='password'
                  disabled={isPending}
                  {...register('confirmPassword', {
                    required: 'Confirm password không được để trống',
                    validate: (value, formValues) => value === formValues.password || 'Mật khẩu xác nhận không khớp'
                  })}
                />
                {errors.confirmPassword && <p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>}
              </Field>

              {errors.root && <p className='text-destructive text-center text-sm'>{errors.root.message}</p>}

              <Field>
                <Button type='submit' disabled={isPending}>
                  {isPending ? 'Đang tạo tài khoản...' : 'Create Account'}
                </Button>

                <FieldDescription className='px-6 text-center'>
                  Already have an account? <a href='/auth/sign-in'>Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
