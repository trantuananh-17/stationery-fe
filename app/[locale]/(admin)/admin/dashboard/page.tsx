import type { LucideIcon } from 'lucide-react';
import { DollarSign, Package, ShoppingBag, UserPlus } from 'lucide-react';

import OrderStatusChart from '@/components/blocks/admin/OrderStatusChart';
import RecentTransactionsTable from '@/components/blocks/admin/RecentTransactionsTable';
import RevenueTargetsCard from '@/components/blocks/admin/RevenueTargetsCard';
import SalesOverview from '@/components/blocks/admin/SalesOverview';
import StatsCard from '@/components/blocks/admin/StatsCard';
import TitlePage from '@/components/blocks/admin/TitlePage';
import TopSellingProducts from '@/components/blocks/admin/TopSellingProducts';
import { routing } from '@/i18n/routing';
import { getToken } from '@/lib/auth';
import { getCurrentMonth, getCurrentMonthFullRange, getLast28DaysRange } from '@/lib/utils';
import {
  getDailyGrowth,
  getDailySummary,
  getGoalProgress,
  getRecentTransaction,
  getSalesChart,
  getTopProducts,
  getTotalOrders
} from '@/services/analytics.service';
import { setRequestLocale } from 'next-intl/server';
import { DailyGrowthResponse, DailySummaryResponse } from '@/types/analytics.type';

type StatFormat = 'currency' | 'percent' | 'number';
export type StatKey = 'totalRevenue' | 'avgOrderValue' | 'totalOrders' | 'totalCustomers';

export type DashboardStats = Record<StatKey, { value: number; percent: string }>;

type StatConfig = {
  key: StatKey;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  format: StatFormat;
};

const statConfigs: StatConfig[] = [
  {
    key: 'totalRevenue',
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
    key: 'totalOrders',
    title: 'Tổng đơn hàng',
    icon: Package,
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-100',
    format: 'number'
  },
  {
    key: 'totalCustomers',
    title: 'Tổng khách hàng',
    icon: UserPlus,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    format: 'number'
  }
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

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

export function mapStats(summary: DailySummaryResponse, growth: DailyGrowthResponse): DashboardStats {
  return {
    totalRevenue: { value: summary.totalRevenue, percent: `${growth.revenueGrowth}%` },
    avgOrderValue: { value: summary.averageOrderValue, percent: `${growth.averageOrderValueGrowth}%` },
    totalOrders: { value: summary.totalOrders ?? 0, percent: `${growth.averageOrderValueGrowth ?? 0}%` },
    totalCustomers: { value: summary.newCustomers ?? 0, percent: `${growth.newCustomersGrowth ?? 0}%` }
  };
}

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const token = await getToken();
  const dateRange = getCurrentMonthFullRange();
  const last28Range = getLast28DaysRange();
  const month = getCurrentMonth();

  const [summaryRes, growthRes, salesChartRes, totalOrdersRes, topProductsRes, goalProgressRes, recentTransactionRes] =
    await Promise.all([
      getDailySummary(token, dateRange),
      getDailyGrowth(token, dateRange),
      getSalesChart(token, last28Range),
      getTotalOrders(token, dateRange),
      getTopProducts(token, dateRange),
      getGoalProgress(token, month),
      getRecentTransaction(token)
    ]);

  const summary = summaryRes.data!.data;
  const growth = growthRes.data!.data;
  const salesChart = salesChartRes.data!.data;
  const totalOrders = totalOrdersRes.data!.data;
  const topProducts = topProductsRes.data!.data;
  const goalProgress = goalProgressRes.data!.data;
  const recentTransaction = recentTransactionRes.data!.data;

  const stats = mapStats(summary, growth);

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
          <SalesOverview salesChartItems={salesChart.data ?? []} />
        </div>
        <div className='h-full xl:col-span-4'>
          <OrderStatusChart orderStatus={totalOrders} />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <div className='h-full xl:col-span-8'>
          <TopSellingProducts products={topProducts.data} />
        </div>
        <div className='h-full xl:col-span-4'>
          <RevenueTargetsCard targets={goalProgress} />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-12'>
        <div className='h-full xl:col-span-12'>
          <RecentTransactionsTable transactions={recentTransaction.data ?? []} />
        </div>
      </div>
    </div>
  );
}
