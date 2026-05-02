'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { getOrCreateSessionId } from '@/lib/cart-session';
import { initAuth } from '@/services/auth.service';
import { getCartCount } from '@/services/cart.service';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const setCartCount = useCartStore((state) => state.setCartCount);
  const resetCart = useCartStore((state) => state.resetCart);

  const setAuth = useAuthStore((state) => state.setAuth);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  useEffect(() => {
    const handleAuth = async () => {
      setAuthLoading(true);
      setAuthInitialized(false);

      try {
        const result = await initAuth();

        if (result.shouldLogout) {
          resetAuth();
          resetCart();

          router.push('/auth/log-out');
          return;
        }

        setAuth({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user
        });

        const sessionId = result.accessToken ? null : getOrCreateSessionId();

        const cartCountResponse = await getCartCount(result.accessToken, sessionId);

        setCartCount(cartCountResponse.data?.data?.count ?? 0);
      } catch {
        resetAuth();
        resetCart();
      } finally {
        setAuthLoading(false);
        setAuthInitialized(true);
      }
    };

    handleAuth();
  }, [router, setAuth, resetAuth, setAuthLoading, setAuthInitialized, setCartCount, resetCart]);

  return children;
}
