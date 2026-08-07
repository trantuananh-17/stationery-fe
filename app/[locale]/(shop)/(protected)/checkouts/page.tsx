import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import CheckoutPageClient from '@/components/blocks/CheckoutPageClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Checkout' });
  return { title: t('title') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Checkout' });

  return (
    <section className='py-8 lg:py-12'>
      <div className='container'>
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>{t('title')}</h1>
        <Suspense
          fallback={
            <div className='mt-12 flex h-full items-center justify-center'>
              <Spinner className='text-primary size-16 md:size-20' />
            </div>
          }
        >
          <CheckoutPageClient />
        </Suspense>
      </div>
    </section>
  );
}
