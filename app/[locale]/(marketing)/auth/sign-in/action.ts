'use server';

import { saveToken } from '@/lib/auth';

type LoginFormValues = {
  email: string;
  password: string;
};

export async function handleLogin(values: LoginFormValues) {
  const apiUrl = process.env.SERVER_API;

  const response = await fetch(`${apiUrl}/auths/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  });

  const data = await response.json();

  const accessToken = data?.data?.accessToken;

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || 'Đăng nhập thất bại'
    };
  }
  const profile = await getProfile(accessToken);

  await saveToken(data.data.accessToken, data.data.refreshToken);

  return {
    success: true,
    data: { ...data.data, profile }
  };
}

const getProfile = async (accessToken: string) => {
  const response = await fetch(`${process.env.SERVER_API}/users/get-profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    return false;
  }

  return response.json();
};
