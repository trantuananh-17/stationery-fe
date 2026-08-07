import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import PaymentClient from '@/components/blocks/PaymentClient';

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className='mt-12 flex h-full items-center justify-center'>
          <Spinner className='text-primary size-16 md:size-20' />
        </div>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}
