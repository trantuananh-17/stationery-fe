import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Provider from '@/components/layouts/Provider';
import AuthInitializer from '@/components/layouts/AuthInitializer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ProtectedShopLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth guard is handled by middleware (proxy.ts).
  // Auth state is initialized client-side via AuthInitializer → /api/auth/session.
  return (
    <Provider>
      <AuthInitializer redirectOnFail />
      {children}
    </Provider>
  );
}
