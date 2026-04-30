import { cache } from 'react';

let refreshTokenPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;
export const makeRefreshToken = async (refreshToken: string) => {
  const requestRefreshToken = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/auths/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.data;
  };

  if (!refreshTokenPromise) {
    refreshTokenPromise = requestRefreshToken();
  }

  return refreshTokenPromise;
};

export const getUser = cache(async () => {
  const accessToken = await getToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/get-profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    // console.log('hello');

    // // Gọi api refresh token để lấy token mới
    // const newToken = await makeRefreshToken(refreshToken!);

    // // Lưu token mới vào cookie
    // await fetch(`http://localhost:3000/api/cookie?key=token`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     value: newToken.accessToken,
    //     maxAge: 60 * 15
    //   })
    // });

    return false;
  }

  const data = await response.json();
  return data.data;
});

export const getToken = async (): Promise<string | null> => {
  let data = null;

  if (isClient()) {
    const response = await fetch('/api/cookie?key=token');

    if (!response.ok) {
      return null;
    }

    data = await response.json();
  } else {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    data = cookieStore.get('token');
  }

  return data?.value ?? null;
};

export const getRefreshToken = async () => {
  let data = null;

  if (isClient()) {
    const response = await fetch('/api/cookie?key=refresh_token');

    if (!response.ok) return null;

    data = await response.json();
  } else {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    data = cookieStore.get('refresh_token');
  }

  return data?.value ?? null;
};

export const deleteToken = async () => {
  await fetch('/api/cookie?key=token', {
    method: 'DELETE'
  });
  await fetch('/api/cookie?key=refresh_token', {
    method: 'DELETE'
  });
};

export const isClient = () => {
  return typeof window !== 'undefined';
};

export const saveToken = async (accessToken: string, refreshToken: string) => {
  console.log('save');

  if (!isClient()) {
    console.log('save client');

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    cookieStore.set('token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES as unknown as number
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRES as unknown as number
    });
  } else {
    console.log('save server');

    await fetch('/api/cookie?key=token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: accessToken,
        maxAge: process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES as unknown as number
      })
    });
    await fetch('/api/cookie?key=refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: accessToken,
        maxAge: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRES as unknown as number
      })
    });
  }
};
