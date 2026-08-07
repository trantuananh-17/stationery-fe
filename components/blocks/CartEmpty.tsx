'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useCartStore } from '@/stores/cart-store';

export function CartEmpty() {
  const closeCart = useCartStore((state) => state.closeCart);
  const t = useTranslations('CartEmpty');

  return (
    <Empty className='py-auto'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <ShoppingBag />
        </EmptyMedia>

        <EmptyTitle>{t('title')}</EmptyTitle>

        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent className='flex-row justify-center gap-2'>
        <Button onClick={closeCart}>
          {t('continueShopping')} <ArrowRight />
        </Button>
      </EmptyContent>
    </Empty>
  );
}
