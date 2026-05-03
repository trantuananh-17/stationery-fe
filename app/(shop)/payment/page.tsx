'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentForm from '@/components/blocks/PaymentForm';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const orderCode = searchParams.get('orderCode');
  const receiverEmail = searchParams.get('receiverEmail');
  const clientSecret = searchParams.get('clientSecret');
  const total = Number(searchParams.get('total') || 0);

  if (!orderId || !orderCode || !receiverEmail || !clientSecret) {
    return <div>Thiếu thông tin thanh toán</div>;
  }

  if (!orderId || !orderCode || !receiverEmail || !clientSecret) {
    return <div>Thiếu thông tin thanh toán</div>;
  }

  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <div className='py-10'>
      <h2 className='mb-5 text-xl font-semibold md:text-2xl'>Thanh toán</h2>
      <div className='container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='space-y-5'>
          {/* <Card className='p-0'>
            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleTrigger asChild>
                <CardContent className='flex cursor-pointer items-center justify-between p-5'>
                  <div className='flex items-center gap-3'>
                    <ShoppingBag className='size-5' />
                    <p className='font-semibold'>{initialItems.length} sản phẩm</p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <p className='font-semibold'>{formatVND(total)}</p>
                    <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
                  </div>
                </CardContent>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className='space-y-4 border-t p-5'>
                  {initialItems.map((item) => (
                    <div key={item.id} className='flex gap-4'>
                      <img src={item.image} alt={item.name} className='size-16 rounded-md object-cover' />

                      <div className='min-w-0 flex-1'>
                        <h3 className='line-clamp-2 font-medium'>{item.name}</h3>
                        <p className='text-muted-foreground text-sm'>Số lượng: {item.quantity}</p>
                      </div>

                      <p className='shrink-0 font-semibold'>{formatVND(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card> */}

          <Card className='p-0'>
            <CardContent className='space-y-5 p-5'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Mã đơn hàng</p>
                <p className='font-semibold'>#{orderCode}</p>
              </div>

              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Email người nhận</p>
                <p className='font-semibold'>{receiverEmail}</p>
              </div>

              <Separator />

              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Tạm tính</span>
                  <span>{formatVND(total)}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>

                <Separator />

                <div className='flex justify-between text-lg font-bold'>
                  <span>Tổng thanh toán</span>
                  <span>{formatVND(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='w-full'>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe'
              },
              loader: 'auto'
            }}
          >
            <PaymentForm clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
