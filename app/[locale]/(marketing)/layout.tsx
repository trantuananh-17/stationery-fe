import type { ReactNode } from 'react';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DefaultLayout>{children}</DefaultLayout>;
}
