'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

type Props = {
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

export function OrderActions({ orderId, status, paymentMethod, primaryAction, secondaryActions }: Props) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const updateStatus = (nextStatus: OrderStatus) => {
    const paymentStatus = getNextPaymentStatus(nextStatus, paymentMethod);
    console.log(orderId);
    console.log(nextStatus);
    console.log(paymentStatus);
  };

  return (
    <div className='mt-3 flex justify-end gap-2'>
      {secondaryActions?.map((action) => (
        <Button
          size={'sm'}
          key={action.label}
          disabled={isPending}
          variant={action.destructive ? 'destructive' : 'default'}
          onClick={() => updateStatus(action.nextStatus)}
          className='text-xs!'
        >
          {action.label}
        </Button>
      ))}

      {primaryAction && (
        <Button
          disabled={isPending}
          size={'sm'}
          variant={'default'}
          onClick={() => updateStatus(primaryAction.nextStatus)}
          className='text-xs!'
        >
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
}
