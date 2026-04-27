import { ProductStatus } from '@/app/(admin)/admin/products/page';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<ProductStatus, string> = {
  active: 'bg-green-600 text-white hover:bg-green-600',
  draft: 'bg-amber-500 text-white hover:bg-amber-500',
  archived: 'bg-red-600 text-white hover:bg-red-600'
};

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge className={cn(statusStyles[status], 'rounded-md px-2 py-0.5 text-[11px] font-medium capitalize shadow-sm')}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
