'use client';

import React, { useEffect } from 'react';

import { notificationSocket } from '@/lib/socket';

import { useAuthStore } from '@/stores/auth-store';

import { NotificationItem, useNotificationStore } from '@/stores/notification.store';

import { getNotifications, getUnReadCount } from '@/services/notification.service';
import { toast } from 'sonner';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const user = useAuthStore((state) => state.user);

  const addNotification = useNotificationStore((state) => state.addNotification);

  const setNotifications = useNotificationStore((state) => state.setNotifications);

  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const setNotificationConnected = useNotificationStore((state) => state.setNotificationConnected);

  const resetNotifications = useNotificationStore((state) => state.resetNotifications);

  useEffect(() => {
    if (!user?.userId || !accessToken) {
      resetNotifications();

      return;
    }

    const bootstrapNotifications = async () => {
      try {
        const [notificationsRes, unreadCountRes] = await Promise.all([
          getNotifications(accessToken, {
            page: 1,
            limit: 10
          }),

          getUnReadCount(accessToken)
        ]);

        const notifications = notificationsRes?.data?.data.items ?? [];

        console.log(notifications);

        const unreadCount = unreadCountRes?.data?.data.count ?? 0;

        setNotifications(notifications);

        setUnreadCount(unreadCount);
      } catch {
        setNotifications([]);

        setUnreadCount(0);
      }
    };

    bootstrapNotifications();

    if (!notificationSocket.connected) {
      notificationSocket.connect();
    }

    const handleConnect = () => {
      setNotificationConnected(true);

      notificationSocket.emit('notification.join', {
        receiverId: user.userId
      });
    };

    const handleDisconnect = () => {
      setNotificationConnected(false);
    };

    const handleNotificationCreated = (data: NotificationItem) => {
      addNotification(data);

      toast.success(data.title, {
        description: data.message,
        position: 'top-right'
      });
    };

    notificationSocket.on('connect', handleConnect);

    notificationSocket.on('disconnect', handleDisconnect);

    notificationSocket.on('notification.created', handleNotificationCreated);

    return () => {
      notificationSocket.off('connect', handleConnect);

      notificationSocket.off('disconnect', handleDisconnect);

      notificationSocket.off('notification.created', handleNotificationCreated);
    };
  }, [
    accessToken,

    user?.userId,

    addNotification,

    setNotifications,

    setUnreadCount,

    setNotificationConnected,

    resetNotifications
  ]);

  return <>{children}</>;
}
