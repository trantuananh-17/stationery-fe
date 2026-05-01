'use client';

import { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

interface ProductImagesProps {
  thumbnail?: string;
  images?: string[];
  name?: string;
}

export default function ProductImages({ thumbnail, images = [], name }: ProductImagesProps) {
  const finalImages = [thumbnail, ...images]
    .filter(Boolean)
    .filter((src, index, arr) => arr.indexOf(src) === index) as string[];

  const [selected, setSelected] = useState(finalImages[0]);

  if (finalImages.length === 0) return null;

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-xl border bg-white p-2 shadow-sm'>
        <AspectRatio ratio={1} className='bg-muted/30 overflow-hidden rounded-lg'>
          <Image
            src={selected}
            alt={name ?? 'Product image'}
            width={800}
            height={800}
            className='size-full object-contain'
          />
        </AspectRatio>
      </div>

      <div className='grid grid-cols-4 gap-3'>
        {finalImages.map((img, index) => {
          const isActive = selected === img;

          return (
            <button
              key={index}
              onClick={() => setSelected(img)}
              className={`rounded-lg border p-1 transition ${
                isActive ? 'border-primary' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <AspectRatio ratio={1} className='overflow-hidden rounded-md'>
                <Image src={img} alt='thumbnail' width={100} height={100} className='size-full object-contain' />
              </AspectRatio>
            </button>
          );
        })}
      </div>
    </div>
  );
}
