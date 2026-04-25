import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  percent: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
}

export default function StatsCard({ title, value, percent, icon: Icon, iconColor, bgColor }: Props) {
  return (
    <Card className='rounded-xl bg-white py-5 shadow-sm'>
      <CardContent className=''>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-muted-foreground text-xs'>{title}</p>

            <h2 className='mt-2 text-2xl font-bold tracking-tight'>{value}</h2>
          </div>

          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>

        <div className='mt-2 flex items-center gap-1 text-xs font-medium text-green-600'>
          <TrendingUp className='h-4 w-4' />
          {percent}
        </div>
      </CardContent>
    </Card>
  );
}
