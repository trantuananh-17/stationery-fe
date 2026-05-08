import { ApiResponse } from '@/types/type';
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { CheckoutFormValues } from '@/types/checkout.type';
import { CheckoutResult, GetOrdersRequest, OrdersResponse } from '@/types/order.type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function createOrder(accessToken: string | null, data: CheckoutFormValues) {
  return fetchWrapper.post<ApiResponse<CheckoutResult>>(`/orders/checkout`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getOrders(accessToken: string | null, params?: GetOrdersRequest) {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.status) {
    searchParams.set('status', params.status);
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  // if (params?.orderBy) {
  //   searchParams.set('orderBy', params.orderBy);
  // }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<OrdersResponse>>(`/orders/admin${queryString ? `?${queryString}` : ''}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
