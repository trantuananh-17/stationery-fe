'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/services/order.service';
import { toast } from 'sonner';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

type Props = {
  accessToken: string | null;
  orderId: string;
  status: OrderStatus;
  paymentMethod: string;

  primaryAction?: {
    label: string;
    nextStatus: OrderStatus;
  };

  secondaryActions?: {
    label: string;
    nextStatus: OrderStatus;
    destructive?: boolean;
  }[];
};

const getNextPaymentStatus = (orderStatus: OrderStatus, paymentMethod: string): PaymentStatus => {
  if (paymentMethod === 'cod' && orderStatus === 'DELIVERED') {
    return 'PAID';
  }

  return 'PENDING';
};

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã huỷ'
};

export function OrderActions({ accessToken, orderId, status, paymentMethod, primaryAction, secondaryActions }: Props) {
  const router = useRouter();

  const [isRefreshing, startTransition] = useTransition();
  const [isUpdating, setIsUpdating] = useState(false);

  const loading = isUpdating || isRefreshing;

  const handleUpdateStatus = async (nextStatus: OrderStatus) => {
    try {
      setIsUpdating(true);

      const paymentStatus = getNextPaymentStatus(nextStatus, paymentMethod);

      await updateOrderStatus(accessToken, orderId, {
        status: nextStatus
      });

      toast.success('Cập nhật trạng thái thành công', {
        description: `Đơn hàng đã được chuyển sang "${ORDER_STATUS_LABEL[nextStatus]}"`
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='mt-3 flex justify-end gap-2'>
      {secondaryActions?.map((action) => (
        <Button
          size='sm'
          key={action.label}
          disabled={loading}
          variant={action.destructive ? 'destructive' : 'default'}
          onClick={() => handleUpdateStatus(action.nextStatus)}
          className='text-xs!'
        >
          {action.label}
        </Button>
      ))}

      {primaryAction && (
        <Button
          disabled={loading}
          size='sm'
          variant='default'
          onClick={() => handleUpdateStatus(primaryAction.nextStatus)}
          className='text-xs!'
        >
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
}
