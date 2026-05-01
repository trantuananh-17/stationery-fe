import { getRefreshToken, getToken, makeRefreshToken } from '@/lib/auth';
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { ApiResponse } from '@/types/type';

export type UserProfile = {
  userId: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
  email: string;
};

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

async function saveAccessToken(token: string) {
  await fetch('/api/cookie?key=token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      value: token,
      maxAge: 60 * 15
    })
  });
}

export async function initAuth() {
  const token = await getToken();
  const refresh = await getRefreshToken();

  if (!token && !refresh) {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      shouldLogout: false
    };
  }

  let currentToken = token;

  if (!currentToken && refresh) {
    const newToken = await makeRefreshToken(refresh);

    if (!newToken) {
      return {
        accessToken: null,
        refreshToken: refresh,
        user: null,
        shouldLogout: true
      };
    }

    currentToken = newToken.accessToken;
    await saveAccessToken(currentToken);
  }

  const response = await fetchWrapper.get<ApiResponse<UserProfile>>('/users/get-profile', {
    headers: {
      Authorization: `Bearer ${currentToken}`
    }
  });

  if (response.status === 401 && refresh) {
    const newToken = await makeRefreshToken(refresh);

    if (!newToken) {
      return {
        accessToken: null,
        refreshToken: refresh,
        user: null,
        shouldLogout: true
      };
    }

    currentToken = newToken.accessToken;
    await saveAccessToken(currentToken);

    const retryResponse = await fetchWrapper.get<ApiResponse<UserProfile>>('/users/get-profile', {
      headers: {
        Authorization: `Bearer ${currentToken}`
      }
    });

    return {
      accessToken: currentToken,
      refreshToken: refresh,
      user: retryResponse.data?.data ?? null,
      shouldLogout: false
    };
  }

  return {
    accessToken: currentToken,
    refreshToken: refresh,
    user: response.data?.data ?? null,
    shouldLogout: false
  };
}
