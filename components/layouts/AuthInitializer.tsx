'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';
import type { UserProfile } from '@/services/auth.service';

type SessionResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
};

/**
 * Fetches auth state client-side from /api/auth/session.
 * Needed when the (protected) layout no longer calls initAuth() server-side,
 * allowing the route segment to be statically rendered.
 */
export default function AuthInitializer({ redirectOnFail = true }: { redirectOnFail?: boolean }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const router = useRouter();

  useEffect(() => {
    if (isAuthInitialized) return;

    let cancelled = false;

    async function initAuth() {
      try {
        const res = await fetch('/api/auth/session');
        if (cancelled) return;

        const session: SessionResponse = await res.json();

        if (!session.user) {
          resetAuth();
          if (redirectOnFail) {
            router.replace('/auth/sign-in');
          }
          return;
        }

        setAuth({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user
        });
      } catch {
        if (!cancelled) {
          resetAuth();
          if (redirectOnFail) {
            router.replace('/auth/sign-in');
          }
        }
      }
    }

    initAuth();

    return () => {
      cancelled = true;
    };
  }, [isAuthInitialized, setAuth, resetAuth, redirectOnFail, router]);

  return null;
}
