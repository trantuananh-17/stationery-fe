import Link from 'next/link';
import { RotateCcw, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Props {
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CartSummary({ totalItems, subtotal, shipping, total }: Props) {
  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  const TRUST_SIGNALS = [
    {
      icon: ShieldCheck,
      title: 'Thanh toán an toàn.'
    },
    {
      icon: RotateCcw,
      title: 'Đổi trả miễn phí trong 30 ngày.'
    },

    {
      icon: Truck,
      title: 'Miễn phí vận chuyển cho đơn hàng trên 100.000VNĐ.'
    }
  ];

  return (
    <div className='bg-card rounded-xl p-6'>
      <h2 className='mb-6 text-2xl font-semibold'>Tóm tắt đơn hàng</h2>

      <div className='space-y-4'>
        <div className='text-muted-foreground flex items-center gap-2'>
          <ShoppingCart className='size-4' />
          <span>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>Tạm tính: </span>
          <span>{formatVND(subtotal)}</span>
        </div>

        <div className='flex items-center justify-between text-base'>
          <span className='text-muted-foreground'>Phí vận chuyển: </span>
          <span>Miễn phí</span>
        </div>

        <Separator />

        <div className='flex items-center justify-between text-xl font-semibold'>
          <span>Tổng tiền: </span>
          <span>{formatVND(total)}</span>
        </div>
      </div>

      <Button asChild size='lg' className='mt-6 w-full'>
        <Link href='/checkout'>Proceed to Checkout</Link>
      </Button>

      <p className='text-muted-foreground mt-4 text-center text-sm'>Thuế được tính khi thanh toán</p>

      <Separator className='my-4' />

      <div className='text-muted-foreground text-md flex flex-col gap-2'>
        {TRUST_SIGNALS.map((item, index) => (
          <div key={index} className='flex items-start justify-start gap-2'>
            <div className='flex h-full items-center justify-center'>
              <item.icon size={20} className='text-primary' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className=''>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
