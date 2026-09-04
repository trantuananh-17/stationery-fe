import { ShieldX } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ForbiddenPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Forbidden' });

  return (
    <div className='flex min-h-[70svh] flex-col items-center justify-center space-y-3 text-center'>
      <ShieldX className='text-muted-foreground size-14' />

      <h1 className='text-2xl font-semibold'>{t('title')}</h1>
      <p className='text-muted-foreground max-w-md'>{t('description')}</p>

      <Link href='/'>
        <Button variant='outline'>{t('backHome')}</Button>
      </Link>
    </div>
  );
}
