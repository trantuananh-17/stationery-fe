import { NextRequest, NextResponse } from 'next/server';
import { getRefreshToken, getToken, getUser, makeRefreshToken } from './lib/auth';

export const proxy = async (request: NextRequest) => {
  const accessToken = await getToken();
  const refreshToken = await getRefreshToken();
  const pathname = request.nextUrl.pathname;

  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
    const response = NextResponse.next();

    const newToken = await makeRefreshToken(refreshToken);

    if (!newToken) {
      const res = NextResponse.redirect(new URL('/auth/sign-in', request.url));

      res.cookies.delete('token');
      res.cookies.delete('refresh_token');

      return res;
    }

    response.cookies.set('token', newToken.accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 15
    });

    response.cookies.set('refresh_token', newToken.refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 86400 * 7
    });

    return response;
  }

  const user = await getUser();

  if (!user) {
    const newToken = await makeRefreshToken(refreshToken!);

    if (newToken) {
      const response = NextResponse.next();

      response.cookies.set('token', newToken.accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 15
      });

      response.cookies.set('refresh_token', newToken.refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 86400 * 7
      });

      return response;
    }
    const response = NextResponse.redirect(new URL('/auth/sign-in', request.url));
    response.cookies.delete('token');
    response.cookies.delete('refresh_token');

    return response;
  }

  const role = user.role;

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin/:path*', '/my-account/:path*']
};
