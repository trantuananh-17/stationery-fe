'use client';

import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PaymentFormProps = {
  clientSecret: string;
};

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

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
        return_url: 'http://localhost:3000?success'
      }
    });

    if (result.error) {
      const message = result.error.message || 'Thanh toán thất bại. Vui lòng thử lại.';

      setErrorMessage(message);
      toast.error(message, { position: 'top-right' });
      setLoading(false);
      return;
    }

    toast.success('Đang chuyển hướng xác nhận thanh toán...', { position: 'top-center' });
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
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </Button>
    </div>
  );
}
