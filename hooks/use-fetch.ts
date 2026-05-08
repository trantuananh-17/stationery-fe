import { FetchWrapper } from '@/lib/fetch-wrapper';
import { useAuthStore } from '@/stores/auth-store';
import { useMemo } from 'react';

export const useFetch = (baseUrl: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const fetchWrapper = useMemo(() => {
    if (!accessToken) return null;

    const instance = new FetchWrapper(baseUrl, {
      Authorization: `Bearer ${accessToken}`
    });

    if (refreshToken) {
      instance.refreshToken(refreshToken);
    }

    return instance;
  }, [baseUrl, accessToken, refreshToken]);

  return {
    fetchWrapper,
    status: fetchWrapper ? 'success' : 'pending'
  };
};
