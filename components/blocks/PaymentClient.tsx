'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from '@/components/blocks/PaymentForm';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPaymentIntent, CreatePaymentIntentResponse } from '@/services/payment.service';
import { getToken } from '@/lib/auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentClient() {
  const t = useTranslations('Payment');
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const receiverEmail = searchParams.get('receiverEmail');
  const total = Number(searchParams.get('total') || 0);

  const [order, setOrder] = useState<CreatePaymentIntentResponse | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const accessToken = await getToken();

        if (!accessToken || !orderId) return;

        const paymentRes = await createPaymentIntent(accessToken, { orderId });

        if (!paymentRes.data) return;

        const orderData = paymentRes.data.data;
        setOrder(orderData);

        const secret = paymentRes.data?.data.clientSecret;
        if (!secret) {
          console.error('No clientSecret');
          return;
        }

        setClientSecret(secret);
      } catch (err) {
        console.error('Create payment intent failed:', err);
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [orderId]);

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  if (loading)
    return (
      <div className='mt-12 flex h-full items-center justify-center'>
        <Spinner className='text-primary size-16 md:size-20' />
      </div>
    );

  if (!clientSecret) return <div>{t('cannotCreate')}</div>;

  return (
    <div className='py-10'>
      <h2 className='mb-5 text-xl font-semibold md:text-2xl'>{t('title')}</h2>

      <div className='container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='space-y-5'>
          <Card className='p-0'>
            <CardContent className='space-y-5 p-5'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>{t('receiverEmail')}</p>
                <p className='font-semibold'>{receiverEmail}</p>
              </div>

              <Separator />

              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>{t('subtotal')}</span>
                  <span>{formatVND(total)}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>{t('shippingFee')}</span>
                  <span>{t('shippingFree')}</span>
                </div>

                <Separator />

                <div className='flex justify-between text-lg font-bold'>
                  <span>{t('total')}</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='w-full'>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: 'stripe' } }}
          >
            <PaymentForm clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
