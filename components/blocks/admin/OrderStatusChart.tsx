'use client';

import { Cell, Label, Pie, PieChart } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

export type OrderStatusData = {
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
};

interface Props {
  orderStatus: OrderStatusData;
}

const chartConfig = {
  orders: {
    label: 'Đơn hàng'
  },
  delivered: {
    label: 'Hoàn thành',
    color: '#fb4b00'
  },
  processing: {
    label: 'Đang xử lý',
    color: '#07998d'
  },
  pending: {
    label: 'Đang chờ',
    color: '#0f4c5c'
  },
  shipped: {
    label: 'Đang giao',
    color: '#2563eb'
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#f6b300'
  }
} satisfies ChartConfig;

export default function OrderStatusChart({ orderStatus }: Props) {
  const chartData = [
    {
      status: 'Hoàn thành',
      orders: orderStatus?.deliveredOrders ?? 0,
      color: '#fb4b00'
    },
    {
      status: 'Đang xử lý',
      orders: orderStatus?.processingOrders ?? 0,
      color: '#07998d'
    },
    {
      status: 'Đang chờ',
      orders: orderStatus?.pendingOrders ?? 0,
      color: '#0f4c5c'
    },
    {
      status: 'Đang giao',
      orders: orderStatus?.shippedOrders ?? 0,
      color: '#2563eb'
    },
    {
      status: 'Đã hủy',
      orders: orderStatus?.cancelledOrders ?? 0,
      color: '#f6b300'
    }
  ];

  const totalOrders = chartData.reduce((total, item) => total + item.orders, 0);

  const pieData = chartData.filter((item) => item.orders > 0);

  return (
    <Card className='flex h-full flex-col gap-5 rounded-xl p-6 shadow-sm'>
      <div>
        <h3 className='text-base font-semibold'>Trạng thái đơn hàng</h3>
        <p className='text-muted-foreground text-xs'>Phân bố trạng thái đơn hàng trong tháng hiện tại</p>
      </div>

      <CardContent className='flex flex-1 flex-col p-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square h-50'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

            <Pie
              data={pieData}
              dataKey='orders'
              nameKey='status'
              innerRadius={55}
              outerRadius={80}
              strokeWidth={5}
              paddingAngle={0}
            >
              {pieData.map((item) => (
                <Cell key={item.status} fill={item.color} />
              ))}

              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null;

                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-2xl font-bold'>
                        {totalOrders.toLocaleString('vi-VN')}
                      </tspan>

                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground text-xs'>
                        Đơn hàng
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className='mt-auto w-full space-y-3 px-1'>
          {chartData.map((item) => (
            <div key={item.status} className='flex items-center justify-between gap-4'>
              <div className='flex min-w-0 items-center gap-2'>
                <span className='size-2.5 shrink-0 rounded-full' style={{ backgroundColor: item.color }} />
                <span className='text-muted-foreground truncate text-xs'>{item.status}</span>
              </div>

              <span className='shrink-0 text-xs font-semibold'>{item.orders.toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
