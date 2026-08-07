import NotificationClient from '@/components/blocks/admin/NotificationClient';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { routing } from '@/i18n/routing';
import { getToken } from '@/lib/auth';
import { getNotifications } from '@/services/notification.service';
import { setRequestLocale } from 'next-intl/server';

const LIMIT = 20;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const token = await getToken();

  const response = await getNotifications(token!, { page: 1, limit: LIMIT });
  const initialNotifications = response.data.data.items ?? [];
  const initialTotal = response.data.data.total ?? 0;

  return (
    <div className='space-y-4'>
      <TitlePage title='Thông báo' subtitle='Luôn cập nhật những thông báo và tin nhắn mới nhất.' />
      <NotificationClient
        token={token!}
        initialNotifications={initialNotifications}
        initialTotal={initialTotal}
        limit={LIMIT}
      />
    </div>
  );
}
