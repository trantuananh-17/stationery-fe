import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriceProps {
  className?: string;
  price: number;
  compareAtPrice?: number | null;
  currency?: string | 'VND';

  /**
   * showBadge = hiển thị badge giảm giá
   */
  showBadge?: boolean;

  /**
   * hasInfo = badge nằm cạnh giá
   * false = badge trôi nổi góc trái trên card
   */
  hasInfo?: boolean;
}

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

export function ProductPrice({ price, compareAtPrice, className, showBadge = true, hasInfo = false }: PriceProps) {
  const hasSale = compareAtPrice != null && compareAtPrice > price;

  const discountPercent = hasSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {hasSale && <span className='text-muted-foreground line-through'>{formatVND(compareAtPrice)}</span>}

      <span className='text-destructive font-bold'>{formatVND(price)}</span>

      {hasSale && showBadge && hasInfo && <Badge variant='destructive'>-{discountPercent}%</Badge>}

      {hasSale && showBadge && !hasInfo && (
        <Badge variant='destructive' className='absolute top-2 left-2 z-10'>
          -{discountPercent}%
        </Badge>
      )}
    </div>
  );
}
