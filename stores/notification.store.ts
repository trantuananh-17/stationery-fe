import { create } from 'zustand';

export type NotificationItem = {
  id: string;
  receiverId: string;
  type: string;
  status: string;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date | null;
};
type NotificationState = {
  notifications: NotificationItem[];
  unreadCount: number;
  isNotificationConnected: boolean;
  setNotifications: (notifications: NotificationItem[]) => void;
  appendNotifications: (notifications: NotificationItem[]) => void;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  setNotificationConnected: (connected: boolean) => void;
  resetNotifications: () => void;
};
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  unreadCount: 0,

  isNotificationConnected: false,

  setNotifications: (notifications) =>
    set({
      notifications
    }),

  appendNotifications: (notifications) =>
    set((state) => ({
      notifications: [...state.notifications, ...notifications]
    })),

  setUnreadCount: (count) =>
    set({
      unreadCount: count
    }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],

      unreadCount: notification.status === 'UNREAD' ? state.unreadCount + 1 : state.unreadCount
    })),

  markAsRead: (notificationId) =>
    set((state) => {
      let changed = false;
      const notifications = state.notifications.map((notification) => {
        if (notification.id !== notificationId) {
          return notification;
        }

        if (notification.status === 'READ') {
          return notification;
        }

        changed = true;
        return {
          ...notification,

          status: 'READ',

          readAt: new Date()
        };
      });
      return {
        notifications,

        unreadCount: changed ? Math.max(state.unreadCount - 1, 0) : state.unreadCount
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,

        status: 'READ',

        readAt: new Date()
      })),

      unreadCount: 0
    })),

  removeNotification: (notificationId) =>
    set((state) => {
      const removed = state.notifications.find((x) => x.id === notificationId);
      return {
        notifications: state.notifications.filter((x) => x.id !== notificationId),

        unreadCount: removed?.status === 'UNREAD' ? Math.max(state.unreadCount - 1, 0) : state.unreadCount
      };
    }),

  setNotificationConnected: (connected) =>
    set({
      isNotificationConnected: connected
    }),

  resetNotifications: () =>
    set({
      notifications: [],

      unreadCount: 0,

      isNotificationConnected: false
    })
}));
