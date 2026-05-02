import Image, { type StaticImageData } from 'next/image';

import Link from 'next/link';

import ProductCard from './ProductCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

import type { LinkType } from '@/types/type';
import type { ProductItem } from '@/types/product.type';

interface ProductShowCaseProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  link?: LinkType;
  image: StaticImageData | string;
  products?: ProductItem[];
}

export default function ProductShowCase({
  title = 'Giá tốt - chính hãng',
  subtitle = 'Trắng tự nhiên - mềm mịn',
  buttonLabel = 'Xem tất cả',
  link,
  image,
  products = []
}: ProductShowCaseProps) {
  if (products.length === 0) return null;

  const href = link?.href ?? '/products';
  const target = link?.target ?? '_self';

  return (
    <section className='py-4 md:py-8'>
      <h2 className='sr-only'>Product Show case</h2>

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-12'>
        <div className='col-span-1 h-full min-h-40 lg:col-span-3'>
          <Card className='group relative h-full min-h-40 cursor-pointer overflow-hidden p-0'>
            <Link href={href} target={target} className='absolute inset-0 z-10'>
              <span className='sr-only'>{buttonLabel}</span>
            </Link>

            <Image
              src={image}
              fill
              className='rounded-xl object-cover transition-transform duration-500 group-hover:scale-110'
              priority
              alt={title}
            />

            <div className='absolute inset-0 rounded-xl bg-black/20 transition-colors duration-500 group-hover:bg-black/40' />

            <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center'>
              <p className='text-sm text-white/75'>{subtitle}</p>

              <p className='text-xl font-semibold text-white'>{title}</p>

              <Button className='pointer-events-auto cursor-pointer' asChild>
                <Link href={href} target={target}>
                  {buttonLabel}
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        <div className='col-span-1 lg:col-span-9'>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
