'use client';

import { useEffect } from 'react';

import EmptyCart from '@/components/blocks/EmptyCart';
import CartItemCard from '@/components/blocks/CardItem';
import CartSummary from '@/components/blocks/CartSummary';
import { Spinner } from '../ui/spinner';
import { useCart } from '@/hooks/use-cart';
import { grpcTimestampToDate } from '@/lib/utils';

export default function CartClient() {
  const { cart, items, isCartLoaded, isItemPending, fetchCart, increaseItem, decreaseItem, removeItem } = useCart();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isCartLoaded) {
    return (
      <div className='mt-12 flex h-full items-center justify-center'>
        <Spinner className='text-primary size-16 md:size-20' />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const sortedItems = [...items].sort((a, b) => {
    const aTime = grpcTimestampToDate(a.createdAt)?.getTime() ?? 0;
    const bTime = grpcTimestampToDate(b.createdAt)?.getTime() ?? 0;

    return aTime - bTime;
  });

  return (
    <div className='grid gap-8 lg:grid-cols-3'>
      <div className='space-y-2 lg:col-span-2'>
        {sortedItems.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            disabled={isItemPending(item.id)}
            onIncrease={increaseItem}
            onDecrease={decreaseItem}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className='lg:col-span-1'>
        <CartSummary totalItems={cart.totalItems} subtotal={cart.subtotal} shipping={0} total={cart.subtotal} />
      </div>
    </div>
  );
}
