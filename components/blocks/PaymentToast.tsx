'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentToast() {
  const t = useTranslations('Payment');
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');
    const paymentIntent = searchParams.get('payment_intent');
    const hasSuccess = searchParams.has('success');

    if (!paymentIntent) return;

    const toastKey = `payment-toast-${paymentIntent}`;

    if (sessionStorage.getItem(toastKey)) return;

    if (redirectStatus === 'succeeded' || hasSuccess) {
      toast.success(t('toastSuccess'), { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
      return;
    }

    if (redirectStatus === 'failed') {
      toast.error(t('toastFailed'), { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
      return;
    }

    if (redirectStatus === 'cancelled') {
      toast.error(t('toastCancelled'), { position: 'top-right' });
      sessionStorage.setItem(toastKey, 'shown');
    }
  }, [searchParams, t]);

  return null;
}
