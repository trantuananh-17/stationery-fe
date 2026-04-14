import { Badge } from '@/components/ui/badge';

type PriceProps = {
  regular: number;
  sale?: number | null;
};

const formatVND = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

export function ProductPrice({ regular, sale }: PriceProps) {
  const hasSale = sale != null;

  return (
    <div className='flex items-center justify-between gap-3'>
      {hasSale && <span className='text-muted-foreground text-sm line-through'>{formatVND(regular)}</span>}

      <span className='text-destructive text-sm font-bold'>{formatVND(sale ?? regular)}</span>

      {hasSale && (
        <Badge className='absolute top-3 left-3' variant='destructive'>
          -{Math.round(((regular - sale!) / regular) * 100)}%
        </Badge>
      )}
    </div>
  );
}
