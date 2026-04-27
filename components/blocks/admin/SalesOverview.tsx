'use client';

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ChartItem = {
  date: string;
  revenue: number;
  orders: number;
  profit: number;
};

const apiData: ChartItem[] = [
  { date: '2026-04-01', revenue: 3200000, orders: 52, profit: 900000 },
  { date: '2026-04-02', revenue: 3500000, orders: 59, profit: 1080000 },
  { date: '2026-04-03', revenue: 3700000, orders: 66, profit: 1180000 },
  { date: '2026-04-04', revenue: 3900000, orders: 70, profit: 1280000 },
  { date: '2026-04-05', revenue: 4000000, orders: 71, profit: 1350000 },
  { date: '2026-04-06', revenue: 3950000, orders: 69, profit: 1340000 },
  { date: '2026-04-07', revenue: 3800000, orders: 65, profit: 1250000 },
  { date: '2026-04-08', revenue: 3600000, orders: 60, profit: 1100000 },
  { date: '2026-04-09', revenue: 3350000, orders: 54, profit: 950000 },
  { date: '2026-04-10', revenue: 3100000, orders: 49, profit: 800000 },
  { date: '2026-04-11', revenue: 2850000, orders: 46, profit: 700000 },
  { date: '2026-04-12', revenue: 2650000, orders: 44, profit: 630000 },
  { date: '2026-04-13', revenue: 2500000, orders: 44, profit: 600000 },
  { date: '2026-04-14', revenue: 2450000, orders: 44, profit: 600000 },
  { date: '2026-04-15', revenue: 2480000, orders: 46, profit: 620000 },
  { date: '2026-04-16', revenue: 2550000, orders: 47, profit: 660000 },
  { date: '2026-04-17', revenue: 2650000, orders: 47, profit: 720000 },
  { date: '2026-04-18', revenue: 2800000, orders: 46, profit: 800000 },
  { date: '2026-04-19', revenue: 3000000, orders: 45, profit: 900000 },
  { date: '2026-04-20', revenue: 3200000, orders: 44, profit: 1000000 },
  { date: '2026-04-21', revenue: 3900000, orders: 44, profit: 1060000 },
  { date: '2026-04-22', revenue: 4100000, orders: 54, profit: 1280000 },
  { date: '2026-04-23', revenue: 4250000, orders: 57, profit: 1300000 },
  { date: '2026-04-24', revenue: 4200000, orders: 62, profit: 11280000 }
];

const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getLastDays = (days = 28) => {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));

    return {
      key: getLocalDateKey(date),
      label: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    };
  });
};

const buildChartData = (data: ChartItem[]) => {
  const days = getLastDays(28);

  return days.map((day) => {
    const item = data.find((x) => x.date === day.key);

    return {
      date: day.label,
      fullDate: day.key,
      revenue: item?.revenue ?? 0,
      orders: item?.orders ?? 0,
      profit: item?.profit ?? 0
    };
  });
};

const formatVND = (value: number) => {
  if (value >= 1_000_000) return `${Number(value / 1_000_000).toFixed(1)}tr`;
  if (value >= 1_000) return `${Number(value / 1_000).toFixed(0)}k`;

  return `${value}`;
};

const getNiceMax = (max: number, base: number) => {
  return Math.max(base, Math.ceil(max / base) * base);
};

const getMoneyTicks = (data: ReturnType<typeof buildChartData>, dataKey: 'revenue' | 'profit') => {
  const max = Math.max(...data.map((item) => Number(item[dataKey] ?? 0)));
  const niceMax = getNiceMax(max, 1_500_000);
  const step = niceMax / 4;

  return [0, step, step * 2, step * 3, niceMax];
};

export default function SalesOverview() {
  const chartData = useMemo(() => buildChartData(apiData), []);

  const revenueTicks = useMemo(() => getMoneyTicks(chartData, 'revenue'), [chartData]);
  const profitTicks = useMemo(() => getMoneyTicks(chartData, 'profit'), [chartData]);

  return (
    <Card className='rounded-xl shadow-sm'>
      <CardContent>
        <Tabs defaultValue='revenue'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-base font-semibold'>Tổng quan bán hàng</h3>
              <p className='text-muted-foreground text-xs'>Hiệu suất bán hàng trong 30 ngày gần nhất</p>
            </div>
            <TabsList className='mb-6 ml-auto grid w-fit grid-cols-3'>
              <TabsTrigger className='text-xs font-medium' value='revenue'>
                Doanh thu
              </TabsTrigger>
              <TabsTrigger className='text-xs' value='orders'>
                Đơn hàng
              </TabsTrigger>
              <TabsTrigger className='text-xs' value='profit'>
                Lợi nhuận
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='revenue'>
            <ChartContainer config={{ revenue: { label: 'Revenue', color: '#ff4d00' } }} className='h-[360px] w-full'>
              <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='revenueFill' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--color-revenue)' stopOpacity={0.35} />
                    <stop offset='80%' stopColor='var(--color-revenue)' stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis dataKey='date' tickLine={false} axisLine={false} interval={4} />
                <YAxis
                  domain={[0, revenueTicks.at(-1) ?? 0]}
                  ticks={revenueTicks}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatVND(Number(value))}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}đ`, 'Revenue']}
                    />
                  }
                />

                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke='var(--color-revenue)'
                  fill='url(#revenueFill)'
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value='orders'>
            <ChartContainer config={{ orders: { label: 'Orders', color: '#0f5265' } }} className='h-[360px] w-full'>
              <BarChart data={chartData} margin={{ top: 8, right: 12, left: 12, bottom: 0 }} barCategoryGap='20%'>
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis dataKey='date' tickLine={false} axisLine={false} interval={4} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />

                <Bar dataKey='orders' fill='var(--color-orders)' radius={[999, 999, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ChartContainer>
          </TabsContent>

          <TabsContent value='profit'>
            <ChartContainer config={{ profit: { label: 'Profit', color: '#009688' } }} className='h-[360px] w-full'>
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id='profitFill' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--color-profit)' stopOpacity={0.32} />
                    <stop offset='80%' stopColor='var(--color-profit)' stopOpacity={0.04} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis dataKey='date' tickLine={false} axisLine={false} interval={4} />
                <YAxis
                  domain={[0, profitTicks.at(-1) ?? 0]}
                  ticks={profitTicks}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatVND(Number(value))}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}đ`, 'Profit']}
                    />
                  }
                />

                <Area
                  type='monotone'
                  dataKey='profit'
                  stroke='var(--color-profit)'
                  fill='url(#profitFill)'
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
