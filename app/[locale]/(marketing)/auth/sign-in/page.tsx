import { LoginForm } from '@/components/blocks/auth/LoginForm';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <div className='bg-background mx-auto flex min-h-[90svh] w-full max-w-sm flex-col items-center justify-center gap-6'>
      <LoginForm className='w-full max-w-md' />
    </div>
  );
}
