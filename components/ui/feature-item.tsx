import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureItem({ icon: Icon, title, description }: Props) {
  return (
    <div className='flex items-center justify-center gap-2'>
      <Icon size={64} className='text-primary' />
      <div className='flex flex-col gap-1'>
        <p className='font-semibold'>{title}</p>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </div>
  );
}
