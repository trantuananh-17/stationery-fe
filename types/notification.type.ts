import { GrpcTimestamp } from '@/lib/utils';

export type UnReadCountRes = {
  count: number;
};

export type NotificationItem = {
  id: string;

  receiverId: string;

  type: string;

  status: string;

  title: string;

  message: string;

  metadata?: Record<string, unknown>;

  createdAt: string;

  updatedAt: string;

  readAt?: string | null;
};

export type NotificationItemGrpc = {
  id: string;

  receiverId: string;

  type: string;

  status: string;

  title: string;

  message: string;

  metadata?: Record<string, unknown>;

  createdAt: GrpcTimestamp;

  updatedAt: GrpcTimestamp;

  readAt?: GrpcTimestamp | null;
};

export type GetNotificationsParams = {
  page?: number;

  limit?: number;

  status?: string;

  type?: string;
};

export type GetNotificationsRes = {
  items: NotificationItemGrpc[];

  total: number;
};
