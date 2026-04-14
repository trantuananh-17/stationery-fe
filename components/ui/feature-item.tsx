import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureItem({ icon: Icon, title, description }: Props) {
  return (
    <div className='flex items-start justify-center gap-2'>
      <div className='flex h-full items-center justify-center'>
        <Icon size={48} className='text-primary' />
      </div>
      <div className='flex flex-col gap-1'>
        <p className='truncate font-semibold'>{title}</p>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}
