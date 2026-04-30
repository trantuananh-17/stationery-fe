import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const GET = async (req: NextRequest) => {
  const key = req.nextUrl.searchParams.get('key');

  if (!key) {
    return NextResponse.json({
      success: false
    });
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(key)?.value;
  if (!value) {
    return NextResponse.json({
      success: false
    });
  }

  return NextResponse.json({
    success: true,
    value
  });
};

export const POST = async (req: NextRequest) => {
  const key = req.nextUrl.searchParams.get('key');
  const { value, maxAge } = await req.json();

  if (!key || !value) {
    return NextResponse.json({
      success: false
    });
  }

  const cookieStore = await cookies();

  const options: {
    path: string;
    httpOnly: boolean;
    maxAge?: number;
  } = {
    path: '/',
    httpOnly: true
  };

  if (maxAge) {
    options.maxAge = maxAge;
  }

  cookieStore.set(key, value, options);

  return NextResponse.json({
    success: true
  });
};

export const DELETE = async (req: NextRequest) => {
  const key = req.nextUrl.searchParams.get('key');
  console.log(key);

  if (!key) {
    return NextResponse.json({
      success: false
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete(key);

  return NextResponse.json({
    success: true
  });
};
