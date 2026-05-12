'use client';

import React, { useEffect } from 'react';

import { getOrCreateSessionId } from '@/lib/cart-session';

import { getCartCount } from '@/services/cart.service';

import { useAuthStore } from '@/stores/auth-store';

import { useCartStore } from '@/stores/cart-store';

export default function ShopProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const setCartCount = useCartStore((state) => state.setCartCount);

  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    const bootstrapCart = async () => {
      try {
        const sessionId = accessToken ? null : getOrCreateSessionId();

        const response = await getCartCount(accessToken, sessionId);

        setCartCount(response.data?.data?.count ?? 0);
      } catch {
        resetCart();
      }
    };

    bootstrapCart();
  }, [accessToken, isAuthInitialized, setCartCount, resetCart]);

  return <>{children}</>;
}
