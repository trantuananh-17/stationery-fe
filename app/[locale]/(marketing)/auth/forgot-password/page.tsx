import { setRequestLocale } from 'next-intl/server';

import ForgotPasswordForm from '@/components/blocks/auth/ForgotPasswordForm';

export const dynamic = 'force-dynamic';

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
      <ForgotPasswordForm />
    </div>
  );
}
