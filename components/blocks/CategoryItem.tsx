import Image, { StaticImageData } from 'next/image';
import { Card } from '../ui/card';
import Link from 'next/link';
import { LinkType } from '@/types/type';

interface Props {
  image: StaticImageData;
  label: string;
  link: LinkType;
}

export default function CategoryItem({ image, label, link }: Props) {
  return (
    <Link href={link.href || '#'} target={link.target || '_self'}>
      <div className='flex h-full flex-col items-center justify-center'>
        <Card className='w-fit overflow-hidden p-0'>
          <div className='relative h-[120px] w-[110px]'>
            <Image
              src={image}
              alt='Category item img'
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-110'
            />
          </div>
        </Card>

        <p className='mt-2 text-center text-xs md:text-sm'>{label}</p>
      </div>
    </Link>
  );
}
