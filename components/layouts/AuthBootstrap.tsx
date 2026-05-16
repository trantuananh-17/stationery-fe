'use client';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import type { UserProfile } from '@/services/auth.service';

type SessionResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
};

export default function AuthBootstrap() {
  const bootstrappedRef = useRef(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  useEffect(() => {
    if (bootstrappedRef.current) return;

    bootstrappedRef.current = true;

    async function bootstrapAuth() {
      setAuthLoading(true);

      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include'
        });

        if (!response.ok) {
          resetAuth();
          return;
        }

        const data = (await response.json()) as SessionResponse;

        if (!data.user) {
          resetAuth();
          return;
        }

        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user
        });
      } catch {
        resetAuth();
      } finally {
        setAuthLoading(false);
        setAuthInitialized(true);
      }
    }

    bootstrapAuth();
  }, [setAuth, resetAuth, setAuthLoading, setAuthInitialized]);

  return null;
}
