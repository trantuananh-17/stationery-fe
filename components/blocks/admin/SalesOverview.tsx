'use client';

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDateISO, grpcTimestampToDate } from '@/lib/utils';
import { SalesChartItem } from '@/types/analytics.type';

type ChartData = {
  date: string;
  fullDate: string;
  revenue: number;
  orders: number;
  profit: number;
};

const getLastDays = (days = 28) => {
  const today = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));

    return {
      key: formatDateISO(date),
      label: date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      })
    };
  });
};

const buildChartData = (salesChartItems: SalesChartItem[]): ChartData[] => {
  const days = getLastDays(28);

  const dataMap = new Map(
    salesChartItems.map((item) => {
      const itemDate = formatDateISO(grpcTimestampToDate(item.date));

      return [itemDate, item];
    })
  );

  return days.map((day) => {
    const item = dataMap.get(day.key);

    return {
      date: day.label,
      fullDate: day.key,
      revenue: item?.revenue ?? 0,
      orders: item?.orders ?? 0,
      profit: item?.estimatedProfit ?? 0
    };
  });
};

const formatVND = (value: number) => {
  if (value >= 1_000_000) return `${Number(value / 1_000_000).toFixed(1)}tr`;
  if (value >= 1_000) return `${Number(value / 1_000).toFixed(0)}k`;

  return `${value}`;
};

const getMoneyTicks = (data: ChartData[], dataKey: 'revenue' | 'profit') => {
  const max = Math.max(...data.map((item) => Number(item[dataKey] ?? 0)));

  const base = max <= 100_000 ? 25_000 : max <= 1_000_000 ? 250_000 : 1_000_000;

  const niceMax = Math.max(base, Math.ceil(max / base) * base);
  const step = niceMax / 4;

  return [0, step, step * 2, step * 3, niceMax];
};

interface Props {
  salesChartItems: SalesChartItem[] | [];
}

export default function SalesOverview({ salesChartItems }: Props) {
  const chartData = useMemo(() => buildChartData(salesChartItems), [salesChartItems]);

  const revenueTicks = useMemo(() => getMoneyTicks(chartData, 'revenue'), [chartData]);
  const profitTicks = useMemo(() => getMoneyTicks(chartData, 'profit'), [chartData]);

  return (
    <Card className='rounded-xl shadow-sm'>
      <CardContent>
        <Tabs defaultValue='revenue'>
          <div className='flex justify-between'>
            <div>
              <h3 className='text-base font-semibold'>Tổng quan bán hàng</h3>
              <p className='text-muted-foreground text-xs'>Hiệu suất bán hàng trong 28 ngày gần nhất</p>
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
