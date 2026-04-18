import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceProps {
  className?: string;
  regular: number;
  sale?: number | null;
  currency?: string | 'VND';
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

export function ProductPrice({ regular, sale, className }: PriceProps) {
  const hasSale = sale != null;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {hasSale && <span className='text-muted-foreground line-through'>{formatVND(regular)}</span>}

      <span className='text-destructive font-bold'>{formatVND(sale ?? regular)}</span>

      {hasSale && (
        <Badge className='absolute top-3 left-3' variant='destructive'>
          -{Math.round(((regular - sale!) / regular) * 100)}%
        </Badge>
      )}
    </div>
  );
}
