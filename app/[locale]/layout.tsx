// import { routing } from '@/i18n/routing';
// import { NextIntlClientProvider } from 'next-intl';
// import { hasLocale } from 'next-intl';
// import { getMessages, setRequestLocale } from 'next-intl/server';
// import { notFound } from 'next/navigation';

// type Props = {
//   children: React.ReactNode;
//   params: Promise<{
//     locale: string;
//   }>;
// };

// export function generateStaticParams() {
//   return routing.locales.map((locale) => ({ locale }));
// }

// export default async function LocaleLayout({ children, params }: Props) {
//   const { locale } = await params;

//   if (!hasLocale(routing.locales, locale)) {
//     notFound();
//   }

//   setRequestLocale(locale);

//   const messages = await getMessages();

//   return (
//     <NextIntlClientProvider locale={locale} messages={messages}>
//       {children}
//     </NextIntlClientProvider>
//   );
// }

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import QueryProvider from '@/providers/QueryProvider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Omit<Props, 'children'>) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'Metadata'
  });

  return {
    title: t('title')
  };
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>{children}</QueryProvider>
    </NextIntlClientProvider>
  );
}
