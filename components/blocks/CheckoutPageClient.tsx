'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';
import { getCart } from '@/services/cart.service';
import { CartItem } from '@/stores/cart-store';
import { Spinner } from '@/components/ui/spinner';
import EmptyCart from '@/components/blocks/EmptyCart';
import CheckoutClient from '@/components/blocks/CheckoutClient';

export default function CheckoutPageClient() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthInitialized) return;

    if (!accessToken) {
      router.replace('/');
      return;
    }

    let cancelled = false;

    async function loadCart() {
      try {
        const response = await getCart(accessToken, null);
        if (cancelled) return;

        const cartItems = response.data?.data?.items ?? [];

        if (!cartItems.length) {
          router.replace('/');
          return;
        }

        setItems(cartItems);
      } catch {
        if (!cancelled) router.replace('/');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuthInitialized, accessToken, router]);

  if (loading || !isAuthInitialized) {
    return (
      <div className='mt-12 flex h-full items-center justify-center'>
        <Spinner className='text-primary size-16 md:size-20' />
      </div>
    );
  }

  if (!items.length) return <EmptyCart />;

  return <CheckoutClient initialItems={items} />;
}
