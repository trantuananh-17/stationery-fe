import { cache } from 'react';

// Phai khop han thuc te cua JWT do auth-service phat hanh
// (token.service.ts: accessToken '1d', refreshToken '7d').
// Cookie het han truoc JWT thi mat phien som; het han sau thi user cam token da chet.
export const ACCESS_TOKEN_MAX_AGE = Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES) || 86400;
export const REFRESH_TOKEN_MAX_AGE = Number(process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRES) || 604800;

type RefreshTokenResult = { accessToken: string; refreshToken: string } | false;

const requestRefreshToken = async (refreshToken: string): Promise<RefreshTokenResult> => {
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

// Key theo chinh refreshToken: gop cac lan goi trung nhau cua CUNG mot user,
// nhung khong bao gio tra token cua user nay cho user khac.
// proxy.ts chay server-side nen module state dung chung cho moi request.
const inflightRefresh = new Map<string, Promise<RefreshTokenResult>>();

export const makeRefreshToken = async (refreshToken: string): Promise<RefreshTokenResult> => {
  const inflight = inflightRefresh.get(refreshToken);

  if (inflight) {
    return inflight;
  }

  const promise = requestRefreshToken(refreshToken).finally(() => {
    inflightRefresh.delete(refreshToken);
  });

  inflightRefresh.set(refreshToken, promise);

  return promise;
};

export const getUserByToken = async (accessToken: string | null) => {
  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/get-profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data;
};

export const getUser = cache(async () => {
  const accessToken = await getToken();

  return getUserByToken(accessToken);
});

// export const getUser = cache(async () => {
//   const accessToken = await getToken();

//   const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/get-profile`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   });

//   if (!response.ok) {
//     // console.log('hello');

//     // // Gọi api refresh token để lấy token mới
//     // const newToken = await makeRefreshToken(refreshToken!);

//     // // Lưu token mới vào cookie
//     // await fetch(`http://localhost:3000/api/cookie?key=token`, {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json'
//     //   },
//     //   body: JSON.stringify({
//     //     value: newToken.accessToken,
//     //     maxAge: 60 * 15
//     //   })
//     // });

//     return false;
//   }

//   const data = await response.json();
//   return data.data;
// });

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
  if (!isClient()) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    cookieStore.set('token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE
    });

    cookieStore.set('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE
    });
  } else {
    await fetch('/api/cookie?key=token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: accessToken,
        maxAge: ACCESS_TOKEN_MAX_AGE
      })
    });
    await fetch('/api/cookie?key=refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: refreshToken,
        maxAge: REFRESH_TOKEN_MAX_AGE
      })
    });
  }
};
