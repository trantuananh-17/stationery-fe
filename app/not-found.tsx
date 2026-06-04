'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex h-dvh flex-col items-center justify-center space-y-2 text-center'>
      <h1 className='text-2xl font-semibold'>Page not found.</h1>
      <p className='text-muted-foreground'>The page you are looking for could not be found.</p>
      <Link prefetch={false} replace href='/'>
        <Button variant='outline'>Go back home</Button>
      </Link>
    </div>
  );
}
