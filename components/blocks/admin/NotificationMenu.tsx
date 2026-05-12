import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';

import { Bell, Package, ShoppingCart, UserPlus, Wallet } from 'lucide-react';

import { cn, formatTimeAgo } from '@/lib/utils';

import { useNotificationStore } from '@/stores/notification.store';

import type { NotificationItem } from '@/stores/notification.store';
import { useAuthStore } from '@/stores/auth-store';
import { markNotificationAsRead } from '@/services/notification.service';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

function getNotificationIcon(type: string) {
  switch (type) {
    case 'ORDER_CREATED':
      return <ShoppingCart className='h-4 w-4' />;

    case 'USER_REGISTERED':
      return <UserPlus className='h-4 w-4' />;

    case 'PAYMENT_SUCCESS':
      return <Wallet className='h-4 w-4' />;

    default:
      return <Package className='h-4 w-4' />;
  }
}

export function NotificationMenu() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const notifications = useNotificationStore((state) => state.notifications);

  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const latestNotifications = notifications.slice(0, 10);

  const handleClickNotification = async (notification: NotificationItem) => {
    if (notification.status === 'UNREAD') {
      await markNotificationAsRead(
        accessToken,

        notification.id
      );

      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative p-2'>
          <Bell className='h-5 w-5' />

          {unreadCount > 0 && (
            <span className='bg-primary absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white shadow-sm'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80 p-0 md:w-95'>
        <div className='border-b px-4 py-3'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold'>Thông báo</h3>

            {unreadCount > 0 && <span className='text-muted-foreground text-xs'>{unreadCount} chưa đọc</span>}
          </div>
        </div>

        <ScrollArea className='h-90'>
          {latestNotifications.length > 0 ? (
            <div className='space-y-1 p-2'>
              {latestNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type='button'
                  onClick={() => handleClickNotification(notification)}
                  className={cn(
                    'hover:bg-muted flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors',
                    notification.status === 'UNREAD' && 'bg-muted/40'
                  )}
                >
                  <div className='bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className='min-w-0 flex-1'>
                    <p className='line-clamp-1 text-sm font-medium'>{notification.title}</p>

                    <p className='text-muted-foreground line-clamp-1 text-sm'>{notification.message}</p>

                    <p className='text-muted-foreground mt-1 text-xs'>{formatTimeAgo(notification.createdAt)}</p>
                  </div>

                  {notification.status === 'UNREAD' && <div className='mt-2 size-2 rounded-full bg-blue-500' />}
                </button>
              ))}
            </div>
          ) : (
            <div className='text-muted-foreground flex h-50 items-center justify-center text-sm'>
              Không có thông báo
            </div>
          )}
        </ScrollArea>

        <Separator />
        <div className='py-2 text-center'>
          <Button type='button' variant={'ghost'} className='text-primary hover:text-primary cursor-pointer'>
            <Link href='/admin/notifications'>View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
