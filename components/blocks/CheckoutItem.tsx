import { Minus, Plus, Trash2 } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart.type';
import { Separator } from '../ui/separator';

interface Props {
  item: CartItem;
}

export default function CheckoutItem({ item }: Props) {
  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  return (
    <>
      <div className='bg-card flex flex-col gap-4 sm:flex-row'>
        <div className='w-full shrink-0 sm:w-28'>
          <AspectRatio ratio={1} className='bg-muted overflow-hidden rounded-lg'>
            <img src={item.image} alt={item.name} className='size-full object-cover' />
          </AspectRatio>
        </div>

        <div className='flex flex-1 flex-col justify-between gap-0'>
          <h2 className='text-lg font-semibold'>{item.name}</h2>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            {item.variant && <p className=''>{item.variant}</p>} •<p className=''>Số lượng: {item.quantity}</p>
          </div>
          <p className='text-muted-foreground text-sm'>Đơn giá: {formatVND(item.price)} mỗi sản phẩm</p>

          <p className='text-sm font-semibold'>Thành tiền: {formatVND(item.price * item.quantity)}</p>
        </div>
      </div>
      <Separator className='my-4' />
    </>
  );
}
