import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import React from 'react';

export default function SpinnerButton({ className, ...props }: React.ComponentProps<'svg'>) {
  return <LoaderIcon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...props} />;
}
