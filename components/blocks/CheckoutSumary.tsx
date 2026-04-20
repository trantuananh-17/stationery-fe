import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lock, LockKeyhole, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import CheckoutItem from './CheckoutItem';
import { CartItem } from '@/types/cart.type';

interface Props {
  initialItems: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CheckoutSumary({ totalItems, subtotal, shipping, total, initialItems }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);

  return (
    <div className='p-2 md:p-4'>
      <h2 className='mb-4 text-lg font-semibold md:mb-6 md:text-xl'>Tóm tắt đơn hàng</h2>
      <div className='space-y-2 lg:col-span-2'>
        {initialItems.map((item) => (
          <CheckoutItem key={item.id} item={item} />
        ))}
      </div>
      <div className='space-y-4'>
        <div className='text-muted-foreground flex items-center gap-2'>
          <ShoppingCart className='size-4' />
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>Tạm tính: </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>Phí vận chuyển: </span>
          <span>Miễn phí</span>
        </div>

        <Separator />

        <div className='flex items-center justify-between text-lg font-semibold'>
          <span>Tổng tiền: </span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button type='submit' size='lg' className='mt-4 w-full'>
        {/* <Link href='/checkout'>Proceed to Checkout</Link> */} Checkout
      </Button>

      <div className='mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900/20'>
        <div className='flex items-center gap-2 text-green-800 md:gap-4 dark:text-green-200'>
          <LockKeyhole size={32} />

          <div>
            <div className='font-semibold'>Thanh toán an toàn</div>
            <div className='text-sm'>
              Thông tin thanh toán của bạn được xử lý một cách an toàn. Chúng tôi không lưu trữ thông tin thẻ tín dụng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
