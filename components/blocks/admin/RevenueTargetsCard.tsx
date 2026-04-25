'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type TargetKey = 'monthlyRevenue' | 'orders' | 'newCustomers';

type RevenueTarget = {
  value: number;
  target: number;
  percent: number;
};

type RevenueTargetsData = Record<TargetKey, RevenueTarget>;

type TargetConfig = {
  key: TargetKey;
  label: string;
  color: string;
  formatter?: (value: number) => string;
};

const targetConfigs: TargetConfig[] = [
  {
    key: 'monthlyRevenue',
    label: 'Doanh thu hàng tháng',
    color: 'bg-orange-600',
    formatter: (value) => `$${value.toLocaleString()}`
  },
  {
    key: 'orders',
    label: 'Tổng đơn hàng',
    color: 'bg-teal-600'
  },
  {
    key: 'newCustomers',
    label: 'Khách hàng mới',
    color: 'bg-cyan-900'
  }
];

export default function RevenueTargetsCard() {
  const [targets, setTargets] = useState<RevenueTargetsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: RevenueTargetsData = {
        monthlyRevenue: {
          value: 128430,
          target: 150000,
          percent: 86
        },
        orders: {
          value: 992,
          target: 1200,
          percent: 83
        },
        newCustomers: {
          value: 347,
          target: 500,
          percent: 69
        }
      };

      setTargets(data);
    };

    fetchData();
  }, []);

  if (!targets) return null;

  return (
    <Card className='h-full gap-0 rounded-xl p-5 shadow-sm'>
      <div className='mb-4 flex items-start justify-between gap-4'>
        <div>
          <h3 className='text-base font-semibold'>Mục tiêu doanh thu</h3>
          <p className='text-muted-foreground text-xs'>Tiến độ đạt mục tiêu doanh thu theo tháng</p>
        </div>
      </div>

      <CardContent className='space-y-5 p-0'>
        {targetConfigs.map((item) => {
          const target = targets[item.key];

          return (
            <div key={item.key} className='space-y-2'>
              <div className='flex items-center justify-between text-xs sm:text-sm'>
                <span className='font-medium'>{item.label}</span>
                <span className='text-sm font-semibold'>{target.percent}%</span>
              </div>

              <Progress value={target.percent} className='h-2' indicatorClassName={item.color} />

              <div className='text-muted-foreground flex justify-between text-xs'>
                <span>{item.formatter ? item.formatter(target.value) : target.value}</span>

                <span>Target: {item.formatter ? item.formatter(target.target) : target.target}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
