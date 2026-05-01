import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceProps {
  className?: string;
  price: number;
  compareAtPrice?: number | null;
  currency?: string | 'VND';
  showBadge?: boolean;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

export function ProductPrice({ price, compareAtPrice, className, showBadge = true }: PriceProps) {
  const hasSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {hasSale && <span className='text-muted-foreground line-through'>{formatVND(compareAtPrice)}</span>}

      <span className='text-destructive font-bold'>{formatVND(price)}</span>

      {hasSale && showBadge && (
        <Badge variant='destructive'>-{Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)}%</Badge>
      )}
    </div>
  );
}
