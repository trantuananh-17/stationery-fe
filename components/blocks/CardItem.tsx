import { Minus, Plus, Trash2 } from 'lucide-react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart.type';

interface Props {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onIncrease, onDecrease, onRemove }: Props) {
  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  return (
    <div className='bg-card flex flex-col gap-4 rounded-xl p-4 sm:flex-row'>
      <div className='w-full shrink-0 sm:w-28'>
        <AspectRatio ratio={1} className='bg-muted overflow-hidden rounded-lg'>
          <img src={item.image} alt={item.name} className='size-full object-cover' />
        </AspectRatio>
      </div>

      <div className='flex flex-1 flex-col justify-between gap-4 sm:flex-row'>
        <div className='space-y-3'>
          <div>
            <h2 className='text-lg font-semibold'>{item.name}</h2>
            {item.variant && <p className='text-muted-foreground text-sm'>{item.variant}</p>}
          </div>

          <div className='flex items-center gap-3'>
            <Button variant='outline' size='icon' className='size-10' onClick={() => onDecrease(item.id)}>
              <Minus className='size-4' />
            </Button>

            <span className='w-6 text-center text-base font-medium'>{item.quantity}</span>

            <Button variant='outline' size='icon' className='size-10' onClick={() => onIncrease(item.id)}>
              <Plus className='size-4' />
            </Button>
          </div>
        </div>

        <div className='flex flex-col justify-between gap-3 sm:items-end'>
          <div className='text-left sm:text-right'>
            <p className='text-xl font-semibold'>{formatVND(item.price * item.quantity)}</p>
            <p className='text-muted-foreground text-sm'>Đơn giá: {formatVND(item.price)} each</p>
          </div>

          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground h-auto px-0 sm:px-3'
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className='mr-2 size-4' />
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
