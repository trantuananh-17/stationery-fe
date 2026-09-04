import { NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  getRefreshToken,
  getToken,
  getUserByToken,
  makeRefreshToken
} from '@/lib/auth';

export async function GET() {
  const accessToken = await getToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({
      accessToken: null,
      refreshToken: null,
      user: null
    });
  }

  if (accessToken) {
    const user = await getUserByToken(accessToken);

    if (user) {
      return NextResponse.json({
        accessToken,
        refreshToken,
        user
      });
    }
  }

  if (!refreshToken) {
    const response = NextResponse.json({
      accessToken: null,
      refreshToken: null,
      user: null
    });

    response.cookies.delete('token');
    response.cookies.delete('refresh_token');

    return response;
  }

  const newToken = await makeRefreshToken(refreshToken);

  if (!newToken) {
    const response = NextResponse.json({
      accessToken: null,
      refreshToken: null,
      user: null
    });

    response.cookies.delete('token');
    response.cookies.delete('refresh_token');

    return response;
  }

  const user = await getUserByToken(newToken.accessToken);

  if (!user) {
    const response = NextResponse.json({
      accessToken: null,
      refreshToken: null,
      user: null
    });

    response.cookies.delete('token');
    response.cookies.delete('refresh_token');

    return response;
  }

  const response = NextResponse.json({
    accessToken: newToken.accessToken,
    refreshToken: newToken.refreshToken,
    user
  });

  response.cookies.set('token', newToken.accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE
  });

  response.cookies.set('refresh_token', newToken.refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE
  });

  return response;
}
