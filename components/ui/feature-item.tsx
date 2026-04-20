import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureItem({ icon: Icon, title, description }: Props) {
  return (
    <div className='grid grid-cols-5 items-start justify-center gap-2'>
      <div className='col-span-1 flex h-full items-center justify-center'>
        <Icon size={36} className='text-primary' />
      </div>
      <div className='col-span-4'>
        <div className='flex flex-col gap-1 text-xs sm:text-sm md:text-[16px]'>
          <p className='truncate font-semibold'>{title}</p>
          <p className='text-muted-foreground'>{description}</p>
        </div>
      </div>
    </div>
  );
}
