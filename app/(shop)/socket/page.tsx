'use client';

import { useEffect, useState } from 'react';

import { notificationSocket } from '@/lib/socket';

type NotificationPayload = {
  id: string;
  receiverId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export default function Page() {
  const [connected, setConnected] = useState(false);

  const [notification, setNotification] = useState<NotificationPayload | null>(null);

  useEffect(() => {
    if (!notificationSocket.connected) {
      notificationSocket.connect();
    }

    notificationSocket.on('connect', () => {
      setConnected(true);

      notificationSocket.emit('notification.join', {
        receiverId: '550e8400-e29b-41d4-a716-446655440000'
      });
    });

    notificationSocket.on('disconnect', () => {
      setConnected(false);
    });

    notificationSocket.on('notification.created', (data: NotificationPayload) => {
      setNotification(data);
    });

    return () => {
      notificationSocket.off('connect');

      notificationSocket.off('disconnect');

      notificationSocket.off('notification.created');
    };
  }, []);

  return (
    <main className='p-10'>
      <h1 className='text-2xl font-bold'>Socket.IO Notification Test</h1>

      <div className='mt-4'>Status: {connected ? '🟢 Connected' : '🔴 Disconnected'}</div>

      <div className='mt-8'>
        {!notification && <div>No notification received yet...</div>}

        {notification && (
          <div className='rounded-lg border p-4'>
            <div>
              <strong>Title:</strong> {notification.title}
            </div>

            <div className='mt-2'>
              <strong>Message:</strong> {notification.message}
            </div>

            <div className='mt-2'>
              <strong>Type:</strong> {notification.type}
            </div>

            <div className='mt-2'>
              <strong>Created At:</strong> {notification.createdAt}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
