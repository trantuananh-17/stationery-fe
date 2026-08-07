import AccountForm from '@/components/blocks/AccountForm';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import React from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Account' });
  return { title: t('title') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Account' });

  return (
    <section className='px-6 py-4'>
      <div className='space-y-1'>
        <h1 className='text-xl font-medium'>{t('title')}</h1>

        <p className='text-muted-foreground'>{t('description')}</p>
      </div>

      <div className='bg-border mt-6 h-px w-full' />
      <AccountForm />
    </section>
  );
}
