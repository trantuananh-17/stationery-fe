'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations('ErrorBoundary');

  return (
    <div className='flex min-h-[70svh] flex-col items-center justify-center space-y-3 text-center'>
      <AlertTriangle className='text-muted-foreground size-14' />

      <h1 className='text-2xl font-semibold'>{t('title')}</h1>
      <p className='text-muted-foreground max-w-md'>{t('description')}</p>

      {error.digest && <p className='text-muted-foreground text-xs'>{t('digest', { digest: error.digest })}</p>}

      <div className='flex gap-2'>
        <Button onClick={reset}>{t('retry')}</Button>

        <Link href='/'>
          <Button variant='outline'>{t('backHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
