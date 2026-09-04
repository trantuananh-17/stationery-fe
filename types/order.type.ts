import { GrpcTimestamp } from '@/lib/utils';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'expired'
  | 'returned';
export type OrderStatusUpper =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'RETURNED';
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
  orderBy?: string;
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

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type OrderDetail = {
  id: string;
  orderNumber: string;
  userId: string;
  customerEmail: string;
  status: OrderStatusUpper;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    phone: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    phone: string;
  };
  items: {
    id: string;
    productId: string;
    variantId: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    subtotal: number;
    attributes: {
      name: string;
      value: string;
    }[];
  }[];
  totalItems: number;
  totalUniqueItems: number;
  createdAt: {
    seconds: {
      low: number;
    };
  };
  updatedAt: {
    seconds: {
      low: number;
    };
  };
};

export type MyOrdersResponse = {
  data: CustomerOrderDetailGrpc[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export interface CustomerOrderDetailGrpc {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  shippingProvider?: string;
  shippingAddress: OrderAddressGrpc;
  items: OrderDetailItemGrpc[];
  totalItems: number;
  totalUniqueItems: number;

  estimatedDelivery?: GrpcTimestamp;
  paidAt?: GrpcTimestamp;
  shippedAt?: GrpcTimestamp;
  deliveredAt?: GrpcTimestamp;
  cancelledAt?: GrpcTimestamp;
  createdAt: GrpcTimestamp;
}

export interface OrderDetailItemGrpc {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  attributes: OrderItemAttributeGrpc[];
}

export interface OrderItemAttributeGrpc {
  name: string;
  value: string;
}

export interface OrderAddressGrpc {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  phone?: string;
}
