import { FetchWrapper } from '@/lib/fetch-wrapper';
import {
  DailyGrowthResponse,
  DailySummaryResponse,
  OrderStatusSummaryResponse,
  RecentTransactionItem,
  RevenueTargetsResponse,
  SalesChartItem,
  TopSellingProductItem
} from '@/types/analytics.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

interface DateRange {
  startDate: string;
  endDate: string;
}

export async function getDailySummary(accessToken: string | null, dateRange: DateRange) {
  return fetchWrapper.get<ApiResponse<DailySummaryResponse>>(
    `/analytics/daily-summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export async function getDailyGrowth(accessToken: string | null, dateRange: DateRange) {
  return fetchWrapper.get<ApiResponse<DailyGrowthResponse>>(
    `/analytics/daily-growth?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export async function getSalesChart(accessToken: string | null, dateRange: DateRange) {
  return fetchWrapper.get<ApiResponse<{ data: SalesChartItem[] }>>(
    `/analytics/sales-chart?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export async function getTotalOrders(accessToken: string | null, dateRange: DateRange) {
  return fetchWrapper.get<ApiResponse<OrderStatusSummaryResponse>>(
    `/analytics/order-status-summary?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export async function getTopProducts(accessToken: string | null, dateRange: DateRange, limit = 5) {
  return fetchWrapper.get<ApiResponse<{ data: TopSellingProductItem[] }>>(
    `/analytics/top-products?limit=${limit}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}

export async function getGoalProgress(accessToken: string | null, month: string) {
  return fetchWrapper.get<ApiResponse<RevenueTargetsResponse>>(`/analytics/goal-progress?bucketMonth=${month}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getRecentTransaction(accessToken: string | null, limit = 10) {
  return fetchWrapper.get<ApiResponse<{ data: RecentTransactionItem[] }>>(
    `/analytics/recent-transactions?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}
