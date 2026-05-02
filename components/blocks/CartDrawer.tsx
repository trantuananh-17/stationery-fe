import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { useCartStore } from '@/stores/cart-store';
import { getCart } from '@/services/cart.service';
import { use } from 'react';
import { getOrCreateSessionId } from '@/lib/cart-session';
import { formatCurrency } from '@/lib/utils';
import { CartEmpty } from './CartEmpty';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function CartDrawer() {
  // const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const router = useRouter();

  const setCart = useCartStore((state) => state.setCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const totalItems = useCartStore((state) => state.cart.totalItems);
  const cart = useCartStore((state) => state.cart);
  const isCartLoaded = useCartStore((state) => state.isCartLoaded);

  const accessToken = useAuthStore((state) => state.accessToken);

  const handleOpenCart = async () => {
    if (!isCartLoaded) {
      const sessionId = accessToken ? null : getOrCreateSessionId();

      const response = await getCart(accessToken, '550e8400-e29b-41d4-a716-446655440000');

      if (response.data?.data) {
        setCart(response.data.data);
      }
    }

    openCart();
  };

  const items = cart.items ?? [];

  const handleGoToCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon-sm' className='relative' onClick={handleOpenCart}>
          <ShoppingBag size={48} />
          {totalItems > 0 && (
            <span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-300 text-xs font-medium text-black'>
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className='flex h-full w-full max-w-sm flex-col p-0 sm:max-w-md' side='right'>
        <SheetHeader className='p-0'>
          <div className='flex items-center p-3 md:p-4'>
            <SheetTitle className='text-lg md:text-xl'>Giỏ hàng {totalItems < 0 ? '' : `(${totalItems})`}</SheetTitle>
          </div>
          <Separator className='mt-0' />
        </SheetHeader>

        <ScrollArea className='min-h-0 p-2 md:p-4'>
          {totalItems === 0 ? (
            <CartEmpty />
          ) : (
            <div className='space-y-4'>
              {items.map((item) => (
                <div key={item.id} className='space-y-4'>
                  <div className='flex flex-col gap-4 sm:flex-row'>
                    <div className='w-full shrink-0 sm:w-28'>
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
          )}
        </ScrollArea>

        {totalItems > 0 && (
          <>
            <SheetFooter className='p-0'>
              <Separator className='mt-0' />
              <div className='mb-2 flex items-center justify-between px-3 pt-3 md:px-4 md:pt-4'>
                <span className='text-muted-foreground'>Tổng tiền: </span>
                <span className='text-sm font-semibold md:text-lg'>{formatCurrency(cart.subtotal)}</span>
              </div>

              <div className='px-3 pb-3 md:px-4 md:pb-4'>
                <Button onClick={handleGoToCart} className='w-full'>
                  Xem giỏ hàng
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
