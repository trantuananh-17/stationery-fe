'use client';

import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import EmptyCart from '@/components/blocks/EmptyCart';
import { checkoutFormSchema, type CheckoutFormValues, type CheckoutPayload } from '@/types/checkout.type';

import CheckoutForm from './CheckoutForm';
import CheckoutSummary from './CheckoutSummary';
import { useAuthStore } from '@/stores/auth-store';
import { createOrder } from '@/services/order.service';
import { useRouter } from '@/i18n/routing';
import { CartItem } from '@/stores/cart-store';
import { CheckoutStockItem } from '@/types/order.type';
import { toast } from 'sonner';
import { createPaymentIntent } from '@/services/payment.service';
import CouponInput from './CouponInput';
import { ValidatedCoupon } from '@/types/coupon.type';
import { getShippingQuote } from '@/services/coupon.service';
import { useQuery } from '@tanstack/react-query';

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

  const [coupon, setCoupon] = useState<ValidatedCoupon | null>(null);

  // Mã có thể mất hiệu lực khi giỏ đổi (không còn đủ giá trị tối thiểu),
  // nên luôn chặn phần giảm không vượt quá tiền hàng.
  const discount = Math.min(coupon?.discount ?? 0, subtotal);
  const amountAfterDiscount = subtotal - discount;

  // Phí ship do server tính; hỏi lại mỗi khi số tiền đổi để hiển thị không lệch với đơn thật.
  const { data: shippingQuote } = useQuery({
    queryKey: ['shipping-quote', amountAfterDiscount],
    queryFn: async () => {
      const response = await getShippingQuote(amountAfterDiscount);

      return response.data?.data ?? null;
    }
  });

  const shipping = shippingQuote?.fee ?? 0;
  const total = amountAfterDiscount + shipping;

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
      notes: data.notes ?? '',
      couponCode: coupon?.code
    };

    if (!accessToken) {
      router.push('/');
      router.refresh();
    }

    const res = await createOrder(accessToken, payload);

    if (!res.data) return;

    if (!res.data.data.success && res.data.data.code === 'STOCK_RESERVATION_FAILED') {
      const map = Object.fromEntries(res.data.data.stockItems.map((item) => [item.variantId, item])) as Record<
        string,
        CheckoutStockItem
      >;

      setStockErrors(map);
      return;
    }

    if (res.data.data.success && payload.paymentMethod === 'stripe') {
      toast.success('Đang chuyển sang trang thanh toán...', { position: 'top-right' });

      const order = res.data.data;

      const params = new URLSearchParams({
        orderId: order.orderId,
        orderCode: order.orderNumber,
        receiverEmail: payload.shippingAddress.email,
        total: total.toString()
      });

      router.push(`/payment?${params.toString()}`);

      return;
    }

    if (res.data.data.success && payload.paymentMethod === 'cod') {
      toast.success('Đặt hàng thành công');
      router.push('/account/orders');
    }
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='lg:col-span-1'>
          <CheckoutForm />
        </div>

        <div className='lg:col-span-1'>
          <CouponInput subtotal={subtotal} applied={coupon} onApply={setCoupon} />

          <CheckoutSummary
            totalItems={totalItems}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            initialItems={items}
            stockErrors={stockErrors}
          />
        </div>
      </form>
    </FormProvider>
  );
}
