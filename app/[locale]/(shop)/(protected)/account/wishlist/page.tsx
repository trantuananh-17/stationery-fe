import { getTranslations, setRequestLocale } from 'next-intl/server';

import WishlistClient from '@/components/blocks/WishlistClient';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Wishlist' });
  return { title: t('title') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Wishlist' });

  return (
    <section className='space-y-4 px-6 py-4'>
      <div className='space-y-1'>
        <h1 className='text-xl font-medium'>{t('title')}</h1>
        <p className='text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <WishlistClient />
    </section>
  );
}
