import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { getUserByToken, makeRefreshToken } from './lib/auth';

const intlProxy = createMiddleware(routing);

type Locale = (typeof routing.locales)[number];

const locales = new Set<string>(routing.locales);

function isLocale(value: string): value is Locale {
  return locales.has(value);
}

function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/')[1];

  return isLocale(firstSegment) ? firstSegment : routing.defaultLocale;
}

function removeLocaleFromPathname(pathname: string) {
  const segments = pathname.split('/');
  const firstSegment = segments[1];

  if (!isLocale(firstSegment)) {
    return pathname;
  }

  const pathnameWithoutLocale = '/' + segments.slice(2).join('/');

  return pathnameWithoutLocale === '/' ? '/' : pathnameWithoutLocale;
}

function isProtectedRoute(pathname: string) {
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  return (
    pathnameWithoutLocale.startsWith('/admin') ||
    pathnameWithoutLocale.startsWith('/account') ||
    pathnameWithoutLocale.startsWith('/cart') ||
    pathnameWithoutLocale.startsWith('/checkouts') ||
    pathnameWithoutLocale.startsWith('/payment')
  );
}

function isAuthRoute(pathname: string) {
  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  return pathnameWithoutLocale === '/auth/sign-in' || pathnameWithoutLocale === '/auth/sign-up';
}

function getLocalizedUrl(request: NextRequest, pathname: string) {
  const locale = getLocaleFromPathname(request.nextUrl.pathname);

  return new URL(`/${locale}${pathname}`, request.url);
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete('token');
  response.cookies.delete('refresh_token');

  return response;
}

function setAuthCookies(
  response: NextResponse,
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
) {
  response.cookies.set('token', tokens.accessToken, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 15
  });

  response.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    path: '/',
    maxAge: 86400 * 7
  });

  return response;
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const intlResponse = intlProxy(request);

  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  const accessToken = request.cookies.get('token')?.value ?? null;
  const refreshToken = request.cookies.get('refresh_token')?.value ?? null;

  if (isAuthRoute(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(getLocalizedUrl(request, '/'));
    }

    return intlResponse;
  }

  if (!isProtectedRoute(pathname)) {
    return intlResponse;
  }

  if (!accessToken) {
    if (!refreshToken) {
      return NextResponse.redirect(getLocalizedUrl(request, '/auth/sign-in'));
    }

    const newToken = await makeRefreshToken(refreshToken);

    if (!newToken) {
      const response = NextResponse.redirect(getLocalizedUrl(request, '/auth/sign-in'));

      return clearAuthCookies(response);
    }

    setAuthCookies(intlResponse, newToken);

    return intlResponse;
  }

  const user = await getUserByToken(accessToken);

  if (!user) {
    if (refreshToken) {
      const newToken = await makeRefreshToken(refreshToken);

      if (newToken) {
        setAuthCookies(intlResponse, newToken);

        return intlResponse;
      }
    }

    const response = NextResponse.redirect(getLocalizedUrl(request, '/auth/sign-in'));

    return clearAuthCookies(response);
  }

  const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

  if (pathnameWithoutLocale.startsWith('/admin') && user.role !== 'ADMIN') {
    return NextResponse.redirect(getLocalizedUrl(request, '/forbidden'));
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
