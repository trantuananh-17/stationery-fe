'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '../ui/aspect-ratio';

import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/stores/cart-store';

type Props = {
  item: CartItem;
};

export function CartDrawerItem({ item }: Props) {
  const { increaseItem, decreaseItem, removeItem, isItemPending } = useCart();

  const pending = isItemPending(item.variantId);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row'>
        <div className='w-full shrink-0 sm:w-20'>
          <AspectRatio ratio={1} className='bg-muted overflow-hidden rounded-lg'>
            <Image
              src={item.productThumbnailSnapshot}
              alt={item.productNameSnapshot}
              width={240}
              height={240}
              className='size-full object-cover'
            />
          </AspectRatio>
        </div>

        <div className='flex min-w-0 flex-1 justify-between gap-2'>
          <div className='flex min-w-0 flex-col'>
            <h4 className='line-clamp-2 font-medium'>{item.productNameSnapshot}</h4>

            <p className='text-muted-foreground text-sm'>{item.variantNameSnapshot}</p>

            <p className='font-semibold'>{formatCurrency(item.unitPriceSnapshot)}</p>

            <div className='mt-2 flex items-center gap-3'>
              <Button
                size='icon'
                variant='outline'
                className='h-8 w-8'
                disabled={pending}
                onClick={() => decreaseItem(item.variantId)}
              >
                <Minus className='h-4 w-4' />
              </Button>

              <span>{item.quantity}</span>

              <Button
                size='icon'
                variant='outline'
                className='h-8 w-8'
                disabled={pending}
                onClick={() => increaseItem(item.variantId)}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Button
            size='icon'
            variant='ghost'
            className='shrink-0 self-start'
            disabled={pending}
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
}
