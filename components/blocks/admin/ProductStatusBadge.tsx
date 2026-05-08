import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductStatus } from '@/types/product.type';

const statusStyles: Record<ProductStatus, string> = {
  ACTIVE: 'border border-emerald-500/30 bg-emerald-500/25 text-emerald-800 hover:bg-emerald-500/25',
  DRAFT: 'border border-amber-500/30 bg-amber-500/25 text-amber-800 hover:bg-amber-500/25',
  ARCHIVED: 'border border-zinc-500/30 bg-zinc-500/20 text-zinc-800 hover:bg-zinc-500/20'
};

const statusLabels: Record<ProductStatus, string> = {
  ACTIVE: 'Đang bán',
  DRAFT: 'Bản nháp',
  ARCHIVED: 'Đã lưu trữ'
};
export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge
      className={cn(
        statusStyles[status],
        'inline-flex min-w-28 justify-center rounded-full px-3 py-1 text-xs shadow-none'
      )}
    >
      {statusLabels[status]}
    </Badge>
  );
}
