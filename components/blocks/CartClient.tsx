'use client';

import { useMemo, useState } from 'react';

import EmptyCart from '@/components/blocks/EmptyCart';
import { CartItem } from '@/types/cart.type';
import CartItemCard from '@/components/blocks/CardItem';
import CartSummary from '@/components/blocks/CartSummary';

interface Props {
  initialItems: CartItem[];
}

export default function CartClient({ initialItems }: Props) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const handleIncrease = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
  };

  const handleDecrease = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const shipping = items.length > 0 ? 0 : 0;
  const total = subtotal + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className='grid gap-8 lg:grid-cols-3'>
      <div className='space-y-2 lg:col-span-2'>
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <div className='lg:col-span-1'>
        <CartSummary totalItems={totalItems} subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  );
}
