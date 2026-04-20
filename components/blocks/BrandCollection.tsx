import Image from 'next/image';
import { Button } from '../ui/button';
import BRAND_BANNER from '@/assets/images/brand-img.webp';
import { Card } from '../ui/card';

export default function BrandCollection() {
  return (
    <section className='py-4 md:py-8'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className=''>
          <Card size='default' className='group relative h-full cursor-pointer p-0'>
            <Image src={BRAND_BANNER} className='h-auto rounded-xl object-cover' priority alt='Paper banner' />
          </Card>
        </div>

        <div className='flex flex-col items-center justify-center gap-2 md:gap-4'>
          <h2 className='text-xl font-semibold md:text-2xl'>Thiên Long Collection</h2>
          <p className='text-muted-foreground text-center text-sm md:text-lg'>
            Bộ sưu tập VPP từ thương hiệu hàng đầu &ldquo;Made in Việt Nam&rdquo;
          </p>
          <Button className='text-sm md:text-lg' variant={'link'}>
            Xem VPP thương hiệu Thiên Long
          </Button>
        </div>
      </div>
    </section>
  );
}
