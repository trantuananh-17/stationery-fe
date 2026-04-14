import Image from 'next/image';
import { Card, CardAction, CardContent } from './card';
import { IconType, LinkType } from '@/types/type';
import { Button } from './button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props {
  image?: IconType;
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
        {image}

        <div className='absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40' />

        <div className='absolute inset-0 flex flex-col items-end justify-center p-6 text-white'>
          <div className='text-end'>
            <h3 className='text-xl font-semibold'>{label}</h3>
            <p className='text-sm text-white/75'>{description}</p>
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
