import { cn } from '@/lib/utils';
import Reviews from '@/components/blocks/Reviews';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BadgeCheck } from 'lucide-react';
import { Separator } from '../ui/separator';
import Image from 'next/image';

interface Props {
  className: string;
  rate: number;
  totalReviewers: number;
}

export default function ProductReview({ className, rate, totalReviewers }: Props) {
  return (
    <div className={cn('py-4 md:py-8', className)}>
      <h3 className='mb-4 text-2xl font-semibold'>Đánh giá sản phẩm</h3>

      <div className='flex flex-col gap-5'>
        <Reviews rate={rate} totalReviewers={totalReviewers} size='lg' />
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </div>
      </div>
    </div>
  );
}

const ReviewCard = ({}) => {
  return (
    <div className='flex flex-col gap-4'>
      <Card className='flex flex-col gap-4 p-3'>
        <div className='flex gap-4'>
          <Avatar size='lg'>
            <AvatarImage src='/avatar.jpg' alt='James R.' />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>

          <div className='flex flex-col'>
            <div className='flex items-center gap-1'>
              <p className='font-medium'>James R.</p>
              <BadgeCheck className='size-4 fill-green-500 stroke-white text-green-500' />
            </div>

            <p className='text-muted-foreground text-sm'>Dec 8, 2024 · Size L, Black</p>
          </div>
        </div>

        <div className=''>
          <p className=''>{`I've been searching for something like this for months. The attention to detail is amazing - from the stitching to the hardware, everything is top notch. Worth every penny.`}</p>

          <div className='relative h-28 w-28 overflow-hidden rounded-xl'>
            <Image
              src={'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/elegant-peach-scarf.png'}
              alt='Review image'
              fill
              className='object-cover'
            />
          </div>
        </div>
      </Card>

      <Separator />
    </div>
  );
};

// {user.name
//   .split(' ')
//   .map(word => word[0])
//   .slice(0, 2)
//   .join('')}
