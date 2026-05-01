'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { AppContext } from '@/components/layouts/Provider';

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
  const { setToken, setRefreshToken, setUser } = use(AppContext);

  useEffect(() => {
    const logout = async () => {
      await removeToken();

      setToken(null);
      setRefreshToken(null);
      setUser(null);

      localStorage.removeItem('sessionId');
      localStorage.setItem('sessionId', crypto.randomUUID());

      queryClient.removeQueries({
        queryKey: ['profile']
      });

      router.replace('/auth/sign-in');
    };

    logout();
  }, [router, queryClient]);

  return <div className='flex min-h-screen items-center justify-center'>Đang đăng xuất...</div>;
}
