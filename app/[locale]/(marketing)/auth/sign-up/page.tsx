import { SignupForm } from '@/components/blocks/auth/SignupForm';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div className='bg-background mx-auto flex min-h-[90svh] w-full max-w-sm flex-col items-center justify-center gap-6'>
      <SignupForm className='w-full max-w-md' />
    </div>
  );
}
