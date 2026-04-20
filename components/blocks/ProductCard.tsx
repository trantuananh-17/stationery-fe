import PAPER from '@/assets/images/product.webp';
import { ProductPrice } from '@/components/blocks/ProductPrice';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard() {
  const link = { href: '/products/abc', target: '_self' as const };
  return (
    <Card className='relative mx-auto w-full max-w-sm gap-2 p-0'>
      <Link href={link.href} target={link.target || '_self'}>
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
      </Link>

      <div className='flex flex-col gap-2 p-2'>
        <Link
          href={link.href}
          target={link.target || '_self'}
          className='text-muted-foreground hover:text-foreground truncate text-sm font-medium transition-colors'
        >
          <CardTitle className='text-xs sm:text-sm'>Bút nước Tizo-TG 310</CardTitle>
        </Link>

        <ProductPrice regular={409900} sale={399000} className='justify-between text-xs xl:text-sm' />
        <Button className='cursor-pointer'>
          <p className='hidden text-xs md:flex xl:text-sm'>Thêm giỏ hàng</p> <ShoppingCart />
        </Button>
      </div>
    </Card>
  );
}
