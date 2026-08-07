import ProductForm from '@/components/blocks/admin/ProductForm';
import { routing } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AdminProducts' });
  return { title: t('createTitle') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'AdminProducts' });

  return (
    <section className='mx-auto max-w-5xl'>
      <h1 className='mb-4 text-xl font-semibold lg:text-2xl'>{t('createTitle')}</h1>
      <ProductForm />
    </section>
  );
}
