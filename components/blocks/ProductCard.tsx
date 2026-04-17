import PAPER from '@/assets/images/product.webp';
import { ProductPrice } from '@/components/blocks/ProductPrice';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function ProductCard() {
  return (
    <div className='cursor-pointer'>
      <Card className='relative mx-auto w-full max-w-sm gap-2 p-0'>
        <AspectRatio ratio={1 / 1} className='relative'>
          <Image
            src={PAPER}
            fill
            sizes='(max-width: 640px) 100vw, 400px'
            className='rounded-xl object-cover transition-transform duration-500 group-hover:scale-110'
            priority
            alt='Paper banner'
          />
        </AspectRatio>

        <div className='flex flex-col gap-2 p-2'>
          <CardTitle>Bút nước Tizo-TG 310</CardTitle>
          <ProductPrice regular={4099000} sale={399000} />
          <Button className='cursor-pointer'>
            Thêm giỏ hàng <ShoppingCart />
          </Button>
        </div>
      </Card>
    </div>
  );
}
