import clsx from 'clsx';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PAYMENT_PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export type CommonStatus = 'ACTIVE_TRUE' | 'ACTIVE_FALSE' | 'VERIFIED_TRUE' | 'VERIFIED_FALSE';

type Status = OrderStatus | PaymentStatus | ProductStatus | CommonStatus;

const statusConfig: Record<
  Status,
  {
    label: string;
    className: string;
    dotClassName: string;
  }
> = {
  // ORDER
  PENDING: {
    label: 'Chờ xử lý',
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  },

  PROCESSING: {
    label: 'Đang xử lý',
    className: 'bg-blue-100 text-blue-700',
    dotClassName: 'bg-blue-500'
  },

  SHIPPED: {
    label: 'Đang vận chuyển',
    className: 'bg-indigo-200 text-indigo-700',
    dotClassName: 'bg-indigo-500'
  },

  DELIVERED: {
    label: 'Hoàn thành',
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  CANCELLED: {
    label: 'Đã hủy',
    className: 'bg-red-100 text-red-700',
    dotClassName: 'bg-red-500'
  },

  // PAYMENT
  PAYMENT_PENDING: {
    label: 'Chưa thanh toán',
    className: 'bg-gray-200 text-gray-780',
    dotClassName: 'bg-gray-400'
  },

  PAID: {
    label: 'Đã thanh toán',
    className: 'bg-green-200 text-green-800',
    dotClassName: 'bg-green-500'
  },

  FAILED: {
    label: 'Thanh toán lỗi',
    className: 'bg-red-100 text-red-700',
    dotClassName: 'bg-red-500'
  },

  REFUNDED: {
    label: 'Đã hoàn tiền',
    className: 'bg-purple-100 text-purple-700',
    dotClassName: 'bg-purple-500'
  },

  // Product
  ACTIVE: {
    label: 'Đang bán',
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  DRAFT: {
    label: 'Bản nháp',
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  },

  ARCHIVED: {
    label: 'Đã lưu trữ',
    className: 'bg-gray-200 text-gray-700',
    dotClassName: 'bg-gray-500'
  },

  // BOOLEAN STATUS
  ACTIVE_TRUE: {
    label: 'Hoạt động',
    className: 'bg-green-100 text-green-700',
    dotClassName: 'bg-green-500'
  },

  ACTIVE_FALSE: {
    label: 'Không hoạt động',
    className: 'bg-gray-200 text-gray-700',
    dotClassName: 'bg-gray-500'
  },

  VERIFIED_TRUE: {
    label: 'Đã xác minh',
    className: 'bg-blue-100 text-blue-700',
    dotClassName: 'bg-blue-500'
  },

  VERIFIED_FALSE: {
    label: 'Chưa xác minh',
    className: 'bg-yellow-100 text-yellow-700',
    dotClassName: 'bg-yellow-500'
  }
};

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
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

      {config.label}
    </span>
  );
}
