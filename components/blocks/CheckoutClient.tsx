'use client';

import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import EmptyCart from '@/components/blocks/EmptyCart';
import { checkoutFormSchema, type CheckoutFormValues, type CheckoutPayload } from '@/types/checkout.type';

import CheckoutForm from './CheckoutForm';
import CheckoutSumary from './CheckoutSumary';
import { useAuthStore } from '@/stores/auth-store';
import { createOrder } from '@/services/order.service';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/stores/cart-store';
import { CheckoutStockItem } from '@/types/order.type';
import { toast } from 'sonner';
import { createPaymentIntent } from '@/services/paymet.service';

interface Props {
  initialItems: CartItem[];
}

const emptyAddress: CheckoutFormValues['shippingAddress'] = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  district: '',
  ward: ''
};

export default function CheckoutClient({ initialItems }: Props) {
  const router = useRouter();

  const [items] = useState<CartItem[]>(initialItems);
  const { accessToken } = useAuthStore();
  const [stockErrors, setStockErrors] = useState<Record<string, CheckoutStockItem>>({});

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.unitPriceSnapshot * item.quantity, 0);
  }, [items]);

  const shipping = 0;
  const total = subtotal + shipping;

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingAddress: emptyAddress,
      paymentMethod: undefined,
      notes: ''
    }
  });

  async function onSubmit(data: CheckoutFormValues) {
    const payload: CheckoutPayload = {
      shippingAddress: data.shippingAddress,
      billingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod,
      notes: data.notes ?? ''
    };

    if (!accessToken) {
      router.push('/');
      router.refresh();
    }

    console.log('submit data:', data);
    console.log('payload:', payload);

    const res = await createOrder(accessToken, payload);

    if (!res.data) return;

    if (!res.data.data.success && res.data.data.code === 'STOCK_RESERVATION_FAILED') {
      const map = Object.fromEntries(res.data.data.stockItems.map((item) => [item.variantId, item])) as Record<
        string,
        CheckoutStockItem
      >;

      console.log(map);

      setStockErrors(map);
      return;
    }

    if (res.data.data.success && payload.paymentMethod === 'stripe') {
      toast.success('Đang chuyển sang trang thanh toán...');

      const order = res.data.data;

      const paymentRes = await createPaymentIntent(accessToken as string, {
        orderId: order.orderId,
        clientEmail: payload.shippingAddress.email,
        lineItems: items.map((item) => ({
          name: item.productNameSnapshot,
          price: item.unitPriceSnapshot,
          quantity: item.quantity
        }))
      });

      const clientSecret = paymentRes.data?.data.clientSecret;

      const params = new URLSearchParams({
        orderId: order.orderId,
        orderCode: order.orderNumber,
        receiverEmail: payload.shippingAddress.email,
        clientSecret: clientSecret ?? '',
        total: total.toString()
      });

      router.push(`/payment?${params.toString()}`);

      return;
    }

    if (res.data.data.success && payload.paymentMethod === 'cod') {
      toast.success('Đặt hàng thành công');
      router.push('/orders');
    }
  }

  const onError: SubmitErrorHandler<CheckoutFormValues> = (errors) => {
    console.log('form errors:', errors);
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='lg:col-span-1'>
          <CheckoutForm />
        </div>

        <div className='lg:col-span-1'>
          <CheckoutSumary
            totalItems={totalItems}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            initialItems={items}
            stockErrors={stockErrors}
          />
        </div>
      </form>
    </FormProvider>
  );
}
