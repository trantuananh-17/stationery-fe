'use client';

import { useEffect, useState } from 'react';

import { Package, ShoppingCart, UserPlus, Wallet } from 'lucide-react';

import { cn, formatTimeAgo } from '@/lib/utils';
import { NotificationItem, useNotificationStore } from '@/stores/notification.store';
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '@/services/notification.service';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';

function getNotificationIcon(type: string) {
  switch (type) {
    case 'ORDER_CREATED':
      return <ShoppingCart className='h-5 w-5' />;

    case 'USER_REGISTERED':
      return <UserPlus className='h-5 w-5' />;

    case 'PAYMENT_SUCCESS':
      return <Wallet className='h-5 w-5' />;

    default:
      return <Package className='h-5 w-5' />;
  }
}

interface Props {
  token: string;
  initialNotifications: NotificationItem[];
  initialTotal: number;
  limit: number;
}

type NotificationTab = 'ALL' | 'UNREAD' | 'READ';

export default function NotificationClient({ token, initialNotifications, initialTotal, limit }: Props) {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const globalMarkAsRead = useNotificationStore((state) => state.markAsRead);
  const globalMarkAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<NotificationTab>('ALL');

  const getStatusParam = (value: NotificationTab) => {
    if (value === 'ALL') return undefined;

    return value;
  };

  const fetchNotifications = async (nextPage: number, nextTab: NotificationTab = tab) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await getNotifications(token, {
        page: nextPage,
        limit: limit,
        status: getStatusParam(nextTab)
      });

      const items = response.data.data.items ?? [];
      const totalItems = response.data.data.total ?? 0;

      if (nextPage === 1) {
        setNotifications(items);
      } else {
        const currentNotifications = useNotificationStore.getState().notifications;
        setNotifications([...currentNotifications, ...items]);
      }

      setTotal(totalItems);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTab = async (value: string) => {
    const nextTab = value as NotificationTab;

    setTab(nextTab);
    await fetchNotifications(1, nextTab);
  };

  const handleLoadMore = async () => {
    await fetchNotifications(page + 1, tab);
  };

  const handleRead = async (notification: NotificationItem) => {
    if (notification.status === 'READ') return;

    globalMarkAsRead(notification.id);

    try {
      await markNotificationAsRead(token, notification.id);
    } catch {}
  };

  const handleReadAll = async () => {
    globalMarkAllAsRead();

    try {
      await markAllNotificationsAsRead(token);
    } catch {}
  };

  const hasMore = notifications.length < total;

  return (
    <Card className='gap-2 border-none p-0 shadow-none'>
      <div className='flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3'>
          <h1 className='text-lg font-medium tracking-tight'>Tất cả thông báo</h1>

          {unreadCount > 0 && (
            <div className='bg-primary text-primary-foreground rounded-lg px-3 py-1 text-xs'>
              {unreadCount} chưa đọc
            </div>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <Tabs value={tab} onValueChange={handleChangeTab}>
            <TabsList>
              <TabsTrigger value='ALL'>Tất cả</TabsTrigger>
              <TabsTrigger value='UNREAD'>Chưa đọc</TabsTrigger>
              <TabsTrigger value='READ'>Đã đọc</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant='outline' onClick={handleReadAll} disabled={unreadCount === 0}>
            Đánh dấu tất cả đã đọc
          </Button>
        </div>
      </div>

      <CardContent className='space-y-1 px-4'>
        {notifications.map((notification) => (
          <button
            key={notification.id}
            type='button'
            onClick={() => handleRead(notification)}
            className={cn(
              'hover:bg-muted/60 flex w-full items-start gap-4 rounded-2xl p-2 text-left transition-all',
              notification.status === 'UNREAD' && 'bg-muted/70'
            )}
          >
            <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
              {getNotificationIcon(notification.type)}
            </div>

            <div className='min-w-0 flex-1 overflow-hidden'>
              <div className='flex items-center gap-2'>
                <p className='line-clamp-1 text-sm font-semibold'>{notification.title}</p>

                {notification.status === 'UNREAD' && <div className='bg-primary size-2 shrink-0 rounded-full' />}
              </div>

              <p className='text-muted-foreground truncate text-xs'>{notification.message}</p>
              <p className='text-muted-foreground text-xs'>{formatTimeAgo(notification.createdAt)}</p>
            </div>
          </button>
        ))}

        {!loading && notifications.length === 0 && (
          <div className='text-muted-foreground flex h-60 items-center justify-center text-sm'>Không có thông báo</div>
        )}

        {hasMore && (
          <div className='flex justify-center py-4'>
            <Button variant='outline' onClick={handleLoadMore} disabled={loading}>
              {loading ? <Spinner /> : 'Xem thêm'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
