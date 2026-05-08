import { GrpcTimestamp } from '@/lib/utils';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderStatusUpper = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type OrderAddress = {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  district: string;
  ward: string;
};

export type CheckoutStockItem = {
  variantId: string;
  requestedQuantity: number;
  success: boolean;
  status: StockStatus;
  availableStock: number;
  remainingStock: number;
  message?: string;
};

export type StockStatus = 'reserved' | 'insufficient_stock' | 'not_found' | 'inactive' | 'invalid_quantity';

export type CheckoutResult =
  | {
      success: true;
      orderId: string;
      orderNumber: string;
      subtotal: number;
      total: number;
      status: string;
      paymentStatus: string;
      stockItems: CheckoutStockItem[];
    }
  | {
      success: false;
      code: 'CART_EMPTY' | 'STOCK_RESERVATION_FAILED';
      message: string;
      stockItems: CheckoutStockItem[];
    };

export type GetOrdersRequest = {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export type OrdersResponse = {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  status: OrderStatusUpper;
  paymentStatus: string;
  total: number;

  createdAt: GrpcTimestamp;
};
