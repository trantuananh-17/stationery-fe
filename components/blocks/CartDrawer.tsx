import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';

const cartItems = [
  {
    id: '1',
    name: 'Minimalist Beige Sneakers',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png',
    price: 120,
    quantity: 1,
    variant: 'Size: EU 36'
  },
  {
    id: '2',
    name: 'Embroidered Blue Top',
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png',
    price: 140,
    quantity: 1,
    variant: 'Size: S'
  },
  {
    id: '3',
    name: 'Classic Fedora Hat',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png',
    price: 84,
    quantity: 1,
    variant: 'Color: Beige'
  },
  {
    id: '4',
    name: 'Minimalist Beige Sneakers',
    image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png',
    price: 120,
    quantity: 1,
    variant: 'Size: EU 36'
  },
  {
    id: '5',
    name: 'Embroidered Blue Top',
    image:
      'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png',
    price: 140,
    quantity: 1,
    variant: 'Size: S'
  }
];

export function CartDrawer() {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon-sm' className='relative'>
          <ShoppingBag size={48} />
          <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-300 text-xs font-medium text-black'>
            3
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent className='flex h-full w-full max-w-sm flex-col p-0 sm:max-w-md' side='right'>
        <SheetHeader className='p-4'>
          <SheetTitle>Shopping Cart (3)</SheetTitle>
        </SheetHeader>

        <Separator />

        <ScrollArea className='min-h-0 p-2 md:p-4'>
          <div className='space-y-4'>
            {cartItems.map((item) => (
              <div key={item.id} className='space-y-4'>
                <div className='flex flex-col gap-4 sm:flex-row'>
                  <div className='w-full shrink-0 sm:w-28'>
                    <AspectRatio ratio={1} className='bg-muted overflow-hidden rounded-lg'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={240}
                        height={240}
                        className='size-full object-cover'
                      />
                    </AspectRatio>
                  </div>

                  <div className='flex min-w-0 flex-1 justify-between gap-2'>
                    <div className='flex min-w-0 flex-col'>
                      <h4 className='line-clamp-2 font-medium'>{item.name}</h4>
                      <p className='text-muted-foreground text-sm'>{item.variant}</p>
                      <p className='font-semibold'>${item.price.toFixed(2)}</p>

                      <div className='mt-2 flex items-center gap-3'>
                        <Button size='icon' variant='outline' className='h-8 w-8'>
                          <Minus className='h-4 w-4' />
                        </Button>

                        <span>{item.quantity}</span>

                        <Button size='icon' variant='outline' className='h-8 w-8'>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    <Button size='icon' variant='ghost' className='shrink-0 self-start'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className='p-3 md:p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-muted-foreground'>Tổng tiền: </span>
            <span className='text-sm font-semibold md:text-lg'>${subtotal.toFixed(2)}</span>
          </div>

          <Button className='w-full'>Xem giỏ hàng</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
