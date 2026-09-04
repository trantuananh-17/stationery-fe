'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Link, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { resetPassword } from '@/services/auth.service';

const MIN_PASSWORD_LENGTH = 6;

export default function ResetPasswordForm() {
  const t = useTranslations('ResetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(t('tooShort', { min: MIN_PASSWORD_LENGTH }), { position: 'top-right' });
      return;
    }

    if (password !== confirm) {
      toast.error(t('mismatch'), { position: 'top-right' });
      return;
    }

    setSubmitting(true);

    const response = await resetPassword(token, password);

    setSubmitting(false);

    if (!response.ok) {
      // Token sai hoặc đã hết hạn 15 phút.
      toast.error(response.data?.message || t('error'), { position: 'top-right' });
      return;
    }

    toast.success(t('success'), { position: 'top-right' });
    router.push('/auth/sign-in');
  }

  if (!token) {
    return (
      <Card className='w-full max-w-md p-0'>
        <CardContent className='space-y-4 p-6 text-center'>
          <h1 className='text-xl font-semibold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{t('missingToken')}</p>

          <Link href='/auth/forgot-password' className='text-sm hover:underline'>
            {t('requestNew')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-md p-0'>
      <CardContent className='space-y-4 p-6'>
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{t('description')}</p>
        </div>

        <Field>
          <FieldLabel htmlFor='reset-password'>{t('newPassword')}</FieldLabel>
          <Input
            id='reset-password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='reset-confirm'>{t('confirmPassword')}</FieldLabel>
          <Input
            id='reset-confirm'
            type='password'
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
          />
        </Field>

        <Button className='w-full' onClick={handleSubmit} disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </CardContent>
    </Card>
  );
}
