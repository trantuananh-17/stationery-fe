'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PaymentFormProps = {
  clientSecret: string;
};

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const locale = useLocale();
  const t = useTranslations('Payment');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const paymentIntentId = clientSecret.split('_secret')[0];

    sessionStorage.removeItem(`payment-toast-${paymentIntentId}`);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}?success`
      }
    });

    if (result.error) {
      const message = result.error.message || t('failed');

      setErrorMessage(message);
      toast.error(message, { position: 'top-right' });
      setLoading(false);
      return;
    }

    toast.success(t('redirecting'), { position: 'top-center' });
  };

  return (
    <div className='mx-auto max-w-md space-y-2 md:space-y-4'>
      <PaymentElement />

      {errorMessage && (
        <div className='border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm'>
          {errorMessage}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={loading || !stripe} className='w-full'>
        {loading ? t('processing') : t('submit')}
      </Button>
    </div>
  );
}
