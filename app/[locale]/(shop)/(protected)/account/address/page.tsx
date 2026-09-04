import { getTranslations, setRequestLocale } from 'next-intl/server';

import AddressBook from '@/components/blocks/AddressBook';
import { getToken } from '@/lib/auth';
import { getAddresses } from '@/services/address.service';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Account' });
  return { title: t('address.title') };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Account' });

  const token = await getToken();
  const response = await getAddresses(token);
  const addresses = response.data?.data ?? [];

  return (
    <section className='space-y-4 px-6 py-4'>
      <div className='space-y-1'>
        <h1 className='text-xl font-medium'>{t('address.title')}</h1>
        <p className='text-muted-foreground'>{t('address.description')}</p>
      </div>

      <AddressBook accessToken={token} addresses={addresses} />
    </section>
  );
}
