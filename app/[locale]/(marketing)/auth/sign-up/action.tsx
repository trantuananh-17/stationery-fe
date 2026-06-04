'use server';

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export async function handleSignup(values: SignupFormValues) {
  const apiUrl = process.env.SERVER_API;

  if (!apiUrl) {
    return {
      success: false,
      message: 'SERVER_API chưa được cấu hình'
    };
  }

  if (values.password !== values.confirmPassword) {
    return {
      success: false,
      message: 'Mật khẩu xác nhận không khớp'
    };
  }

  const response = await fetch(`${apiUrl}/auths/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password
    }),
    cache: 'no-store'
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data?.message || 'Đăng ký thất bại'
    };
  }

  return {
    success: true,
    data
  };
}
