'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/services/order.service';

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

      console.log({
        orderId,
        nextStatus,
        paymentStatus
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
