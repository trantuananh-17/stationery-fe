'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'RETURNED';

export type PaymentStatus = 'PAYMENT_PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export type CommonStatus = 'ACTIVE_TRUE' | 'ACTIVE_FALSE' | 'VERIFIED_TRUE' | 'VERIFIED_FALSE';

type Status = OrderStatus | PaymentStatus | ProductStatus | CommonStatus;

const statusConfig: Record<
  Status,
  {
    className: string;
    dotClassName: string;
  }
> = {
  // ORDER
  PENDING: {
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  },

  PROCESSING: {
    className: 'bg-blue-100 text-blue-700',
    dotClassName: 'bg-blue-500'
  },

  SHIPPED: {
    className: 'bg-indigo-200 text-indigo-700',
    dotClassName: 'bg-indigo-500'
  },

  DELIVERED: {
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  CANCELLED: {
    className: 'bg-red-100 text-red-700',
    dotClassName: 'bg-red-500'
  },

  EXPIRED: {
    className: 'bg-orange-100 text-orange-700',
    dotClassName: 'bg-orange-500'
  },

  RETURNED: {
    className: 'bg-slate-200 text-slate-700',
    dotClassName: 'bg-slate-500'
  },

  // PAYMENT
  PAYMENT_PENDING: {
    className: 'bg-gray-200 text-gray-700',
    dotClassName: 'bg-gray-400'
  },

  PAID: {
    className: 'bg-green-200 text-green-800',
    dotClassName: 'bg-green-500'
  },

  FAILED: {
    className: 'bg-red-100 text-red-700',
    dotClassName: 'bg-red-500'
  },

  REFUNDED: {
    className: 'bg-purple-100 text-purple-700',
    dotClassName: 'bg-purple-500'
  },

  // PRODUCT
  ACTIVE: {
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  DRAFT: {
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  },

  ARCHIVED: {
    className: 'bg-gray-200 text-gray-700',
    dotClassName: 'bg-gray-500'
  },

  // BOOLEAN STATUS
  ACTIVE_TRUE: {
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  ACTIVE_FALSE: {
    className: 'bg-gray-200 text-gray-700',
    dotClassName: 'bg-gray-500'
  },

  VERIFIED_TRUE: {
    className: 'bg-blue-100 text-blue-700',
    dotClassName: 'bg-blue-500'
  },

  VERIFIED_FALSE: {
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  }
};

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('Status');

  const config = statusConfig[status];

  if (!config) return null;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <span className={clsx('h-2 w-2 rounded-full', config.dotClassName)} />

      {t(status)}
    </span>
  );
}
