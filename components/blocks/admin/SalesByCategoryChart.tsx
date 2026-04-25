'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const chartData = [
  { category: 'Giấy in văn phòng', revenue: 3900 },
  { category: 'Bút và viết', revenue: 2750 },
  { category: 'Sổ - Vở học sinh', revenue: 1500 },
  { category: 'Dụng cụ văn phòng', revenue: 980 },
  { category: 'Đồ dùng học sinh', revenue: 740 },
  { category: 'Vật tư tiêu hao', revenue: 380 }
];

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: '#0d9488'
  }
} satisfies ChartConfig;

export default function SalesByCategoryChart() {
  return (
    <Card className='h-full gap-0 rounded-xl p-6 shadow-sm'>
      <div className='mb-5'>
        <h3 className='text-base font-semibold'>Doanh thu theo danh mục</h3>
        <p className='text-muted-foreground text-xs'>Phân bổ doanh thu theo loại sản phẩm</p>
      </div>

      <CardContent className='flex flex-1 p-0'>
        <ChartContainer config={chartConfig} className='w-full'>
          <BarChart data={chartData} layout='vertical' margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} strokeDasharray='3 3' />

            <XAxis
              type='number'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value / 1000}tr`}
            />

            <YAxis dataKey='category' type='category' tickLine={false} axisLine={false} tickMargin={10} width={120} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(value) => [`${Number(value).toLocaleString()} triệu`, 'Doanh thu']} />
              }
            />

            <Bar dataKey='revenue' fill='var(--color-revenue)' radius={[0, 6, 6, 0]} barSize={28} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
