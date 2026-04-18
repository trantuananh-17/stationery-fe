'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import type { ProductImagesProps } from './ProductDetail';

export default function ProductImages({ images }: ProductImagesProps) {
  return (
    <Carousel
      opts={{
        breakpoints: {
          '(min-width: 768px)': {
            active: false
          }
        }
      }}
    >
      <CarouselContent className='gap-4 md:m-0 md:grid md:grid-cols-3 xl:gap-5'>
        {images.map((img, index) => (
          <CarouselItem className='first:col-span-3 md:p-0' key={`product-detail-image-${index}`}>
            <AspectRatio ratio={1} className='overflow-hidden rounded-lg'>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={img.sizes}
                className='block size-full object-cover object-center'
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className='md:hidden'>
        <CarouselPrevious className='left-4' />
        <CarouselNext className='right-4' />
      </div>
    </Carousel>
  );
}
