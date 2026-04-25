'use-client';
import { useSidebar } from '@/components/ui/sidebar';
import { Diamond } from 'lucide-react';

export default function NavHeader() {
  const { state, isMobile } = useSidebar();
  const shouldShowLabel = isMobile || state === 'expanded';

  return (
    <div className='flex flex-1 gap-3 py-2'>
      <div className='bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl'>
        <Diamond className='size-4 h-4 w-4 text-white' strokeWidth={2} />
      </div>

      {shouldShowLabel && (
        <div className='flex flex-col items-start justify-start gap-1.5 leading-0'>
          <span className='text-sm font-semibold'>Minaco</span>
          <span className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>Dashboard</span>
        </div>
      )}
    </div>
  );
}
