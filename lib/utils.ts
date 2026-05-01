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

export function grpcTimestampToDate(timestamp?: GrpcTimestamp | null): Date | null {
  if (!timestamp) return null;

  const seconds = typeof timestamp.seconds === 'number' ? timestamp.seconds : timestamp.seconds.low;

  return new Date(seconds * 1000);
}
