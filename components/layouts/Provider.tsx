'use client';

import React, { useEffect } from 'react';

import type { UserProfile } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth-store';

type InitialAuth = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  shouldLogout?: boolean;
};

export default function Provider({
  children,
  initialAuth
}: Readonly<{
  children: React.ReactNode;
  initialAuth?: InitialAuth | null;
}>) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const setAuthInitialized = useAuthStore((state) => state.setAuthInitialized);

  useEffect(() => {
    if (initialAuth === undefined) {
      return;
    }

    setAuthLoading(false);

    if (!initialAuth || !initialAuth.user || initialAuth.shouldLogout) {
      resetAuth();
      setAuthInitialized(true);
      return;
    }

    setAuth({
      accessToken: initialAuth.accessToken,
      refreshToken: initialAuth.refreshToken,
      user: initialAuth.user
    });

    setAuthInitialized(true);
  }, [initialAuth, setAuth, resetAuth, setAuthLoading, setAuthInitialized]);

  return children;
}
