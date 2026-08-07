import { AccountSidebar } from '@/components/blocks/AccountSidebar';
import { Card } from '@/components/ui/card';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Layout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='flex gap-2'>
      <AccountSidebar />

      <main className='flex-1 p-4'>
        <Card className='min-h-[75svh] rounded-xs p-0'>{children}</Card>
      </main>
    </div>
  );
}
