import { GrpcTimestamp } from '@/lib/utils';

export type GetOrdersRequest = {
  search?: string;
  orderBy?: string;
  page?: number;
  limit?: number;
};

export type Customer = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  isActive: boolean;
  isVerified: boolean;
  totalOrder: number;
  totalPrice: number;
  createdAt: GrpcTimestamp;
};

export type CustomersResponse = {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CustomerInfo = {
  id: string;

  firstName: string;
  lastName: string;
  fullName: string;

  email: string;
  phone?: string;

  avatar?: string;

  dateOfBirth?: GrpcTimestamp;

  isVerified: boolean;
  isActive: boolean;

  totalOrders: number;
  amountSpent: number;

  customerSince: GrpcTimestamp;

  lastOrder?: {
    orderId: string;
    orderNumber: string;

    totalPrice: number;

    orderStatus: string;
    paymentStatus: string;

    orderedAt: GrpcTimestamp;

    items: {
      productId: string;
      variantId?: string;

      name: string;
      thumbnail?: string;

      quantity: number;
      subtotal: number;
    }[];
  };

  createdAt: GrpcTimestamp;
};

export type UserProfileAuth = {
  email: string;
  firstName: string;
  lastName: string;
  permisstions: string[];
  role: string;
  userId: string;
};
