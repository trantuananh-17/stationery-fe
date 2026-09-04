'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { forgotPassword } from '@/services/auth.service';

export default function ForgotPasswordForm() {
  const t = useTranslations('ForgotPassword');

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;

    setSubmitting(true);

    const response = await forgotPassword(email.trim());

    setSubmitting(false);

    if (!response.ok) {
      toast.error(t('error'), { position: 'top-right' });
      return;
    }

    setSent(true);
  }

  return (
    <Card className='w-full max-w-md p-0'>
      <CardContent className='space-y-4 p-6'>
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{sent ? t('sentDescription') : t('description')}</p>
        </div>

        {!sent && (
          <>
            <Field>
              <FieldLabel htmlFor='forgot-email'>{t('email')}</FieldLabel>
              <Input
                id='forgot-email'
                type='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
              />
            </Field>

            <Button className='w-full' onClick={handleSubmit} disabled={submitting}>
              {submitting ? t('submitting') : t('submit')}
            </Button>
          </>
        )}

        <Link href='/auth/sign-in' className='text-muted-foreground block text-center text-sm hover:underline'>
          {t('backToSignIn')}
        </Link>
      </CardContent>
    </Card>
  );
}
