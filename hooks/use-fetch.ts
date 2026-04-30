import { AppContext } from '@/components/layouts/Provider';
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { use, useMemo } from 'react';

export const useFetch = (baseUrl: string) => {
  const { accessToken, refreshToken } = use(AppContext);

  const fetchWrapper = useMemo(() => {
    if (!accessToken) return null;

    const instance = new FetchWrapper(baseUrl, {
      Authorization: `Bearer ${accessToken}`
    });

    instance.refreshToken(refreshToken!);

    return instance;
  }, [baseUrl, accessToken, refreshToken]);

  return {
    fetchWrapper,
    status: fetchWrapper ? 'success' : 'pending'
  };
};
