import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Account' });
  return { title: t('address.title') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Account' });

  return (
    <section className='px-6 py-4'>
      <div className='space-y-1'>
        <h1 className='text-xl font-medium'>{t('address.title')}</h1>
        <p className='text-muted-foreground'>{t('address.description')}</p>
      </div>
    </section>
  );
}
