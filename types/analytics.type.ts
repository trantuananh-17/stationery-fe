import { GrpcTimestamp } from '@/lib/utils';
import { OrderStatusUpper } from './order.type';

export type DailySummaryResponse = {
  totalRevenue: number;
  averageOrderValue: number;
  totalOrders: number;
  newCustomers: number;
};

export type DailyGrowthResponse = {
  revenueGrowth: number;
  averageOrderValueGrowth: number;
  ordersGrowth: number;
  newCustomersGrowth: number;
};

export type SalesChartItem = {
  date: GrpcTimestamp;
  revenue: number;
  orders: number;
  estimatedProfit: number;
};

export interface OrderStatusSummaryResponse {
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export type TopSellingProductItem = {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
};

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

export type RecentTransactionItem = {
  orderId: string;
  customerName: string;
  totalAmount: string;
  totalItems: number;
  status: OrderStatusUpper;
  orderedAt: GrpcTimestamp;
};
