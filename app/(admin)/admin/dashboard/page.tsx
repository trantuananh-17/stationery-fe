'use client';

import { useEffect, useState } from 'react';
import { DollarSign, RotateCcw, ShoppingBag, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import StatsCard from '@/components/blocks/admin/StatsCard';
import SalesOverview from '@/components/blocks/admin/SalesOverview';
import OrderStatusChart from '@/components/blocks/admin/OrderStatusChart';
import TopSellingProducts from '@/components/blocks/admin/TopSellingProducts';
import SalesByCategoryChart from '@/components/blocks/admin/SalesByCategoryChart';
import RecentTransactionsTable from '@/components/blocks/admin/RecentTransactionsTable';
import RevenueTargetsCard from '@/components/blocks/admin/RevenueTargetsCard';
import TitlePage from '@/components/blocks/admin/TitlePage';

type StatKey = 'sales' | 'avgOrderValue' | 'conversionRate' | 'refundRate';
type StatFormat = 'currency' | 'percent' | 'number';

type StatConfig = {
  key: StatKey;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  format: StatFormat;
};

type DashboardStats = Record<
  StatKey,
  {
    value: number;
    percent: string;
  }
>;

const statConfigs: StatConfig[] = [
  {
    key: 'sales',
    title: 'Tổng doanh thu',
    icon: DollarSign,
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-100',
    format: 'currency'
  },
  {
    key: 'avgOrderValue',
    title: 'Giá trị đơn trung bình',
    icon: ShoppingBag,
    iconColor: 'text-teal-500',
    bgColor: 'bg-teal-100',
    format: 'currency'
  },
  {
    key: 'conversionRate',
    title: 'Tỷ lệ chuyển đổi',
    icon: TrendingUp,
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-100',
    format: 'percent'
  },
  {
    key: 'refundRate',
    title: 'Tỷ lệ hoàn trả',
    icon: RotateCcw,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    format: 'percent'
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);

const formatPercent = (value: number) => `${value.toLocaleString('vi-VN')}%`;

const formatStatValue = (format: StatFormat, value: number) => {
  switch (format) {
    case 'currency':
      return formatCurrency(value);

    case 'percent':
      return formatPercent(value);

    case 'number':
      return value.toLocaleString('vi-VN');

    default:
      return value.toString();
  }
};

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fakeData: DashboardStats = {
      sales: {
        value: 100000000,
        percent: '+18.2%'
      },
      avgOrderValue: {
        value: 64500,
        percent: '+4.8%'
      },
      conversionRate: {
        value: 3.24,
        percent: '+0.8%'
      },
      refundRate: {
        value: 2.1,
        percent: '-0.3%'
      }
    };

    const timer = setTimeout(() => {
      setStats(fakeData);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex flex-col gap-6'>
      <TitlePage
        title='Bảng điều khiển'
        subtitle='Chào mừng trở lại. Theo dõi hiệu suất bán hàng và các chỉ số kinh doanh của bạn.'
      />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {statConfigs.map((item) => {
          const stat = stats?.[item.key];

          return (
            <StatsCard
              key={item.key}
              title={item.title}
              value={stat ? formatStatValue(item.format, stat.value) : '...'}
              percent={stat?.percent ?? '...'}
              icon={item.icon}
              iconColor={item.iconColor}
              bgColor={item.bgColor}
            />
          );
        })}
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <div className='h-full xl:col-span-8'>
          <SalesOverview />
        </div>
        <div className='h-full xl:col-span-4'>
          <OrderStatusChart />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <div className='h-full xl:col-span-8'>
          <TopSellingProducts />
        </div>
        <div className='h-full min-h-90 xl:col-span-4'>
          <SalesByCategoryChart />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <div className='h-full xl:col-span-8'>
          <RecentTransactionsTable />
        </div>
        <div className='h-full xl:col-span-4'>
          <RevenueTargetsCard />
        </div>
      </div>
    </div>
  );
}
