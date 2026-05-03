'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    const paymentIntent = searchParams.get('payment_intent');
    const hasSuccess = searchParams.has('success');

    if (!paymentIntent) return;

    const toastKey = `payment-toast-${paymentIntent}`;

    if (sessionStorage.getItem(toastKey)) return;

    if (redirectStatus === 'succeeded' || hasSuccess) {
      toast.success('Thanh toán thành công', { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
      return;
    }

    if (redirectStatus === 'failed') {
      toast.error('Thanh toán thất bại', { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
      return;
    }

    if (redirectStatus === 'canceled') {
      toast.error('Bạn đã hủy thanh toán', { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
    }
  }, [searchParams]);

  return null;
}
