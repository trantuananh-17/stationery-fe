'use client';

import { makeRefreshToken } from '@/lib/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import { AppContext } from '../layouts/Provider';

export default function RefreshToken() {
  const router = useRouter();
  const { refreshToken } = use(AppContext);

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!refreshToken) return null;

      const newToken = await makeRefreshToken(refreshToken);

      if (!newToken?.accessToken) {
        throw new Error('Refresh failed');
      }

      await fetch('/api/cookie?key=token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: newToken.accessToken,
          maxAge: 60 * 15
        })
      });

      return newToken.accessToken;
    },
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      router.push('/auth/log-out');
    }
  });

  useEffect(() => {
    if (refreshToken) {
      refreshMutation.mutate();
    }
  }, [refreshToken]);

  return null;
}
