import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  rate: number;
  totalReviewers?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MAX_STARS = 5;

const sizeStyles = {
  sm: {
    star: 'h-3.5 w-3.5',
    gap: 'gap-0.5',
    text: 'text-xs'
  },
  md: {
    star: 'h-4 w-4',
    gap: 'gap-1',
    text: 'text-sm'
  },
  lg: {
    star: 'h-6 w-6',
    gap: 'gap-1.5',
    text: 'text-base'
  }
};

export default function Reviews({ rate, totalReviewers, className, size = 'md' }: Props) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex items-center', styles.gap)}>
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const fill = Math.max(0, Math.min(1, rate - index)) * 100;

          return (
            <div key={index} className={cn('relative shrink-0', styles.star)}>
              <Star className={cn('absolute inset-0 fill-gray-200 stroke-gray-300', styles.star)} />

              <div className='absolute inset-0 overflow-hidden' style={{ width: `${fill}%` }}>
                <Star className={cn('fill-yellow-500 stroke-yellow-500', styles.star)} />
              </div>
            </div>
          );
        })}
      </div>

      <p className={cn('text-muted-foreground leading-none font-medium whitespace-nowrap', styles.text)}>
        {totalReviewers} Đánh giá
      </p>
    </div>
  );
}
