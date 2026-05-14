import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

export type RevenueTargetsResponse = {
  revenueGoal: number;
  currentRevenue: number;
  revenueProgress: number;
  ordersGoal: number;
  currentOrders: number;
  ordersProgress: number;
  customersGoal: number;
  currentCustomers: number;
  customersProgress: number;
};

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

interface Props {
  targets?: RevenueTargetsResponse;
}

const targetConfigs: TargetConfig[] = [
  {
    key: 'monthlyRevenue',
    label: 'Doanh thu hàng tháng',
    color: 'bg-orange-600',
    formatter: formatCurrency
  },
  {
    key: 'orders',
    label: 'Tổng đơn hàng',
    color: 'bg-teal-600',
    formatter: (value) => value.toLocaleString('vi-VN')
  },
  {
    key: 'newCustomers',
    label: 'Khách hàng mới',
    color: 'bg-cyan-900',
    formatter: (value) => value.toLocaleString('vi-VN')
  }
];

function mapRevenueTargets(targets?: RevenueTargetsResponse): RevenueTargetsData {
  return {
    monthlyRevenue: {
      value: targets?.currentRevenue ?? 0,
      target: targets?.revenueGoal ?? 0,
      percent: targets?.revenueProgress ?? 0
    },
    orders: {
      value: targets?.currentOrders ?? 0,
      target: targets?.ordersGoal ?? 0,
      percent: targets?.ordersProgress ?? 0
    },
    newCustomers: {
      value: targets?.currentCustomers ?? 0,
      target: targets?.customersGoal ?? 0,
      percent: targets?.customersProgress ?? 0
    }
  };
}

function clampProgress(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

export default function RevenueTargetsCard({ targets }: Props) {
  const revenueTargets = mapRevenueTargets(targets);

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
          const target = revenueTargets[item.key];
          const formatter = item.formatter ?? ((value: number) => value.toLocaleString('vi-VN'));

          return (
            <div key={item.key} className='space-y-2'>
              <div className='flex items-center justify-between text-xs sm:text-sm'>
                <span className='font-medium'>{item.label}</span>
                <span className='text-sm font-semibold'>{target.percent.toLocaleString('vi-VN')}%</span>
              </div>

              <Progress value={clampProgress(target.percent)} className='h-2' indicatorClassName={item.color} />

              <div className='text-muted-foreground flex justify-between text-xs'>
                <span>{formatter(target.value)}</span>
                <span>Mục tiêu: {formatter(target.target)}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
