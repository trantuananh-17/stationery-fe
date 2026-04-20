import ProductCard from '@/components/blocks/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRightFromLine, ArrowRightIcon } from 'lucide-react';

export default function BestPriceSection() {
  return (
    <section className='py-4 md:py-8'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold md:text-xl lg:text-2xl'>Lựa chọn tốt nhất</h2>

          <Button size={'lg'} className='cursor-pointer text-xs md:text-sm'>
            Xem tất cả <ArrowRightIcon />
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </section>
  );
}
