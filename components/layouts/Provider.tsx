'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initAuth, UserProfile } from '@/services/auth.service';
import { getOrCreateSessionId } from '@/lib/cart-session';
import { getCartCount } from '@/services/cart.service';
import { useCartStore } from '@/stores/cart-store';

type AppContext = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthLoading: boolean;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

export const AppContext = React.createContext({} as AppContext);

export default function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [accessToken, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const route = useRouter();

  const setCartCount = useCartStore((state) => state.setCartCount);
  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const result = await initAuth();

        setToken(result.accessToken);
        setRefreshToken(result.refreshToken);
        setUser(result.user);

        if (result.shouldLogout) {
          resetCart();
          route.push('/auth/log-out');
          return;
        }

        const sessionId = result.accessToken ? null : getOrCreateSessionId();

        const cartCountResponse = await getCartCount(result.accessToken, '550e8400-e29b-41d4-a716-446655440000');

        setCartCount(cartCountResponse.data?.data?.count ?? 0);
      } catch {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    handleAuth();
  }, [route]);

  return (
    <AppContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthLoading,
        setToken,
        setRefreshToken,
        setUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
