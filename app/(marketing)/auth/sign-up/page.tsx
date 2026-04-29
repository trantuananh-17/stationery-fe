import { SignupForm } from '@/components/blocks/auth/SignupForm';

export default function Page() {
  return (
    <div className='bg-background mx-auto flex min-h-[90svh] w-full max-w-sm flex-col items-center justify-center gap-6'>
      <SignupForm className='w-full max-w-md' />
    </div>
  );
}
