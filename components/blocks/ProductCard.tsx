import { ProductPrice } from '@/components/blocks/ProductPrice';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import type { ProductItem } from '@/types/product.type';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;
  const href = `/products/${product.slug}`;

  return (
    <Card className='relative mx-auto w-full max-w-sm gap-2 overflow-hidden p-0'>
      <Link href={href}>
        <AspectRatio ratio={1 / 1} className='bg-muted/30 relative'>
          <Image
            src={product.thumbnail}
            fill
            sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
            className='rounded-xl object-cover transition-transform duration-500 hover:scale-105'
            alt={product.name}
          />
        </AspectRatio>
      </Link>

      <div className='flex flex-col gap-2 p-2'>
        <Link href={href} className='text-muted-foreground hover:text-foreground transition-colors'>
          <CardTitle className='line-clamp-2 min-h-9 text-xs sm:text-sm'>{product.name}</CardTitle>
        </Link>

        <ProductPrice
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          className='justify-between text-xs xl:text-sm'
          showBadge
        />

        <Button className='cursor-pointer'>
          <p className='hidden text-xs md:flex xl:text-sm'>Thêm giỏ hàng</p>
          <ShoppingCart />
        </Button>
      </div>
    </Card>
  );
}
