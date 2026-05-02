import ProductCard from '@/components/blocks/ProductCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ProductItem } from '@/types/product.type';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface BestPriceSectionProps {
  title?: string;
  products?: ProductItem[];
  href?: string;
  className?: string;
  showHeader?: boolean;
}

export default function BestPriceSection({
  title = 'Lựa chọn tốt nhất',
  products = [],
  href = '/products',
  className,
  showHeader = true
}: BestPriceSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn('py-4 md:py-8', className)}>
      <div className='flex flex-col gap-4'>
        {showHeader && (
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold md:text-xl lg:text-2xl'>{title}</h2>

            <Button size='lg' className='cursor-pointer text-xs md:text-sm' asChild>
              <Link href={href}>
                Xem tất cả <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        )}

        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
