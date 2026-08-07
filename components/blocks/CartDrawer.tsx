'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';

import { useRouter } from '@/i18n/routing';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { getCart } from '@/services/cart.service';
import { getOrCreateSessionId } from '@/lib/cart-session';
import { formatCurrency } from '@/lib/utils';

import { CartDrawerItem } from './CartDrawerItem';
import { CartEmpty } from './CartEmpty';

export function CartDrawer() {
  const router = useRouter();
  const t = useTranslations('CartDrawer');

  const accessToken = useAuthStore((state) => state.accessToken);
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const isCartLoaded = useCartStore((state) => state.isCartLoaded);
  const setCartLoaded = useCartStore((state) => state.setCartLoaded);

  const [isLoading, setIsLoading] = useState(false);

  const totalItems = cart.totalItems;
  const items = cart.items ?? [];

  const fetchCart = async () => {
    if (isCartLoaded || isLoading) return;
    setIsLoading(true);
    try {
      const sessionId = accessToken ? null : getOrCreateSessionId();
      const response = await getCart(accessToken, sessionId);
      if (response.data?.data) {
        setCart(response.data.data);
        setCartLoaded(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await fetchCart();
      openCart();
    } else {
      closeCart();
    }
  };

  const handleGoToCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button id='btn_cart_icon' variant='ghost' size='icon-sm' className='relative'>
          <ShoppingBag size={22} />
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
            <SheetTitle className='text-lg md:text-xl'>{t('title', { count: totalItems })}</SheetTitle>
          </div>
          <Separator />
        </SheetHeader>

        <ScrollArea className='min-h-0 p-2 md:p-4'>
          {totalItems === 0 ? (
            <CartEmpty />
          ) : (
            <div className='space-y-4'>
              {items.map((item) => (
                <CartDrawerItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </ScrollArea>

        {totalItems > 0 && (
          <SheetFooter className='p-0'>
            <Separator />
            <div className='mb-2 flex items-center justify-between px-3 pt-3 md:px-4 md:pt-4'>
              <span className='text-muted-foreground'>{t('total')}</span>
              <span data-testid='cart-total' className='text-sm font-semibold md:text-lg'>
                {formatCurrency(cart.subtotal)}
              </span>
            </div>
            <div className='px-3 pb-3 md:px-4 md:pb-4'>
              <Button onClick={handleGoToCart} className='w-full'>
                {t('viewCart')}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
