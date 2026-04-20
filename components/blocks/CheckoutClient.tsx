'use client';

import { useMemo, useState } from 'react';
import { FormProvider, SubmitErrorHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import EmptyCart from '@/components/blocks/EmptyCart';
import type { CartItem } from '@/types/cart.type';
import { checkoutFormSchema, type CheckoutFormValues, type CheckoutPayload } from '@/types/checkout.type';

import CheckoutForm from './CheckoutForm';
import CheckoutSumary from './CheckoutSumary';

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
  const [items] = useState<CartItem[]>(initialItems);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
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

    console.log('submit data:', data);
    console.log('payload:', payload);

    // ví dụ:
    // await checkoutApi.createOrder(payload);
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
          />
        </div>
      </form>
    </FormProvider>
  );
}
