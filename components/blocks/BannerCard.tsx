import Image, { StaticImageData } from 'next/image';
import { LinkType } from '@/types/type';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  image: StaticImageData;
  label: string;
  description: string;
  primary: boolean;
  buttonLabel: string;
  link: LinkType;
}

export default function BannerCard({ image, label, description, primary, buttonLabel, link }: Props) {
  return (
    <Link href={link.href || '#'} target={link.target || '_self'}>
      <Card className='group relative h-full cursor-pointer overflow-hidden rounded-2xl border-0'>
        <Image
          src={image}
          alt='Banner deli min'
          fill
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />

        <div className='absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40' />

        <div className='absolute inset-0 flex flex-col items-end justify-center gap-2 p-6 text-white'>
          <div className='text-end'>
            <h3 className='text-xl font-semibold'>{label}</h3>
            <p className='pl-10 text-sm text-white/75'>{description}</p>
          </div>

          <Button
            variant={primary ? 'default' : 'secondary'}
            className={cn(
              'transition-colors',
              primary
                ? 'text-primary-foreground hover:text-primary-foreground/90'
                : 'text-secondary-foreground hover:text-secondary-foreground/90'
            )}
          >
            {buttonLabel}
          </Button>
        </div>
      </Card>
    </Link>
  );
}
