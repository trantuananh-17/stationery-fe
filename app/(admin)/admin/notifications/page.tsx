import NotificationClient from '@/components/blocks/admin/NotificationClient';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getToken } from '@/lib/auth';
import { getNotifications } from '@/services/notification.service';

const LIMIT = 20;

export default async function Page() {
  const token = await getToken();

  const response = await getNotifications(token!, {
    page: 1,
    limit: LIMIT
  });

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
