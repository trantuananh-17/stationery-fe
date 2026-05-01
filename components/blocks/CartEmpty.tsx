'use client';

import { ShoppingBag, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useCartStore } from '@/stores/cart-store';

export function CartEmpty() {
  const closeCart = useCartStore((state) => state.closeCart);
  return (
    <Empty className='py-auto'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <ShoppingBag />
        </EmptyMedia>

        <EmptyTitle>Giỏ hàng trống</EmptyTitle>

        <EmptyDescription>
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy thêm sản phẩm để tiếp tục mua sắm.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className='flex-row justify-center gap-2'>
        <Button onClick={closeCart}>
          Tiếp tục mua sắm <ArrowRight />
        </Button>
      </EmptyContent>
    </Empty>
  );
}
