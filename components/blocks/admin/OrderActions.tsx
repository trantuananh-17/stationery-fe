'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/services/order.service';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import type { OrderStatusUpper, PaymentStatus } from '@/types/order.type';

type Props = {
  accessToken: string | null;
  orderId: string;
  status: OrderStatusUpper;
  paymentMethod: string;

  primaryAction?: {
    label: string;
    nextStatus: OrderStatusUpper;
  };

  secondaryActions?: {
    label: string;
    nextStatus: OrderStatusUpper;
    destructive?: boolean;
  }[];
};

const getNextPaymentStatus = (orderStatus: OrderStatusUpper, paymentMethod: string): PaymentStatus => {
  if (paymentMethod === 'cod' && orderStatus === 'DELIVERED') {
    return 'PAID';
  }

  return 'PENDING';
};

export function OrderActions({ accessToken, orderId, status, paymentMethod, primaryAction, secondaryActions }: Props) {
  const t = useTranslations('Status');
  const tOrder = useTranslations('OrderActions');
  const router = useRouter();

  const [isRefreshing, startTransition] = useTransition();
  const [isUpdating, setIsUpdating] = useState(false);

  const loading = isUpdating || isRefreshing;

  const handleUpdateStatus = async (nextStatus: OrderStatusUpper) => {
    try {
      setIsUpdating(true);

      const paymentStatus = getNextPaymentStatus(nextStatus, paymentMethod);

      await updateOrderStatus(accessToken, orderId, {
        status: nextStatus
      });

      toast.success(tOrder('updateSuccess'), {
        description: tOrder('updateSuccessDesc', { status: t(nextStatus) })
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
