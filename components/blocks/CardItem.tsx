import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/stores/cart-store';
import { Separator } from '../ui/separator';

interface Props {
  item: CartItem;
  disabled?: boolean;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, disabled = false, onIncrease, onDecrease, onRemove }: Props) {
  const formatVND = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  const image = item.productThumbnailSnapshot || item.imageVariantSnapshot || '/placeholder.png';

  return (
    <>
      <div className='bg-card flex flex-col gap-4 rounded-xl p-4 sm:flex-row'>
        <div className='w-full shrink-0 sm:w-28'>
          <AspectRatio ratio={1} className='bg-muted overflow-hidden rounded-lg'>
            <Image
              src={image}
              alt={item.productNameSnapshot}
              width={300}
              height={300}
              className='size-full object-cover'
            />
          </AspectRatio>
        </div>

        <div className='flex flex-1 flex-col justify-between gap-4 sm:flex-row'>
          <div className='space-y-3'>
            <div>
              <h2 className='text-lg font-semibold'>{item.productNameSnapshot}</h2>

              {item.variantNameSnapshot && <p className='text-muted-foreground text-sm'>{item.variantNameSnapshot}</p>}
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='icon'
                className='size-10'
                disabled={disabled}
                onClick={() => onDecrease(item.variantId)}
              >
                <Minus className='size-4' />
              </Button>

              <span className='w-6 text-center text-base font-medium'>{item.quantity}</span>

              <Button
                variant='outline'
                size='icon'
                className='size-10'
                disabled={disabled}
                onClick={() => onIncrease(item.variantId)}
              >
                <Plus className='size-4' />
              </Button>
            </div>
          </div>

          <div className='flex flex-row-reverse justify-between gap-3 sm:flex-col sm:items-end'>
            <Button
              variant='ghost'
              size='icon-sm'
              disabled={disabled}
              className='text-muted-foreground h-auto p-0 sm:p-2'
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className='size-5' />
            </Button>

            <div className='text-left sm:text-right'>
              <p className='text-sm md:text-lg'>{formatVND(item.unitPriceSnapshot * item.quantity)}</p>
              <p className='text-muted-foreground text-sm'>Đơn giá: {formatVND(item.unitPriceSnapshot)} mỗi sản phẩm</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />
    </>
  );
}
