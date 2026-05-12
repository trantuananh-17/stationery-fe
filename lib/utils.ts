import { DEFAULT_LIMIT } from '@/constants/common.constant';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export type GrpcLong = {
  low: number;
  high: number;
  unsigned: boolean;
};

export type GrpcTimestamp = {
  seconds: number | GrpcLong;
  nanos: number;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

export function formatDate(value?: Date | string | null) {
  if (!value) return '-';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('vi-VN');
}

export function grpcTimestampToDate(timestamp?: GrpcTimestamp | null): Date | null {
  if (!timestamp) return null;

  const seconds = typeof timestamp.seconds === 'number' ? timestamp.seconds : timestamp.seconds.low;

  return new Date(seconds * 1000);
}

export function getDaysSince(timestamp?: GrpcTimestamp | null): number | null {
  const date = grpcTimestampToDate(timestamp);

  if (!date) return null;

  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

export function getDaysSinceText(timestamp?: GrpcTimestamp | null): string {
  const diffDays = getDaysSince(timestamp);

  if (diffDays === null) return '-';

  if (diffDays <= 0) return 'Hôm nay';

  return `${diffDays} ngày`;
}

export function getValidPage(value?: string) {
  const page = Number(value ?? 1);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

export function getValidLimit(value?: string) {
  const limit = Number(value ?? DEFAULT_LIMIT);

  if (!Number.isFinite(limit) || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return limit;
}

export function parseDate(value?: Date | string | GrpcTimestamp | null): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'object' && 'seconds' in value) {
    const seconds = typeof value.seconds === 'number' ? value.seconds : value.seconds.low;

    return new Date(seconds * 1000);
  }

  return null;
}

export function formatTimeAgo(value?: Date | string | GrpcTimestamp | null): string {
  const date = parseDate(value);

  if (!date) {
    return '-';
  }

  const diffMs = Date.now() - date.getTime();

  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) {
    return 'Vừa xong';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} phút trước`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} ngày trước`;
  }

  return formatDate(date);
}
