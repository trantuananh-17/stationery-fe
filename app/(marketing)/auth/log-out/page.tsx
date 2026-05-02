'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';

const removeToken = async () => {
  const [tokenRes, refreshRes] = await Promise.all([
    fetch('/api/cookie?key=token', {
      method: 'DELETE'
    }),
    fetch('/api/cookie?key=refresh_token', {
      method: 'DELETE'
    })
  ]);

  if (!tokenRes.ok || !refreshRes.ok) {
    throw new Error('Logout failed');
  }

  return Promise.all([tokenRes.json(), refreshRes.json()]);
};

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  const resetCart = useCartStore((state) => state.resetCart);

  useEffect(() => {
    const logout = async () => {
      try {
        setAuthLoading(true);

        await removeToken();

        resetAuth();
        resetCart();

        localStorage.removeItem('sessionId');
        localStorage.setItem('sessionId', crypto.randomUUID());

        queryClient.removeQueries({
          queryKey: ['profile']
        });

        queryClient.clear();

        setAuthInitialized(true);

        router.replace('/auth/sign-in');
      } catch {
        setAuthLoading(false);
        setAuthInitialized(true);
      }
    };

    logout();
  }, [router, queryClient, resetAuth, resetCart, setAuthLoading, setAuthInitialized]);

  return <div className='flex min-h-screen items-center justify-center'>Đang đăng xuất...</div>;
}
