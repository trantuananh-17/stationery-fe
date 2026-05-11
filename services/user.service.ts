import { FetchWrapper } from '@/lib/fetch-wrapper';
import { CheckoutResult, GetOrdersRequest, OrderDetail, OrdersResponse, OrderStatusUpper } from '@/types/order.type';
import { ApiResponse } from '@/types/type';
import { Customer, CustomerInfo, CustomersResponse } from '@/types/user.type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function getUsers(accessToken: string | null, params?: GetOrdersRequest) {
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

  return fetchWrapper.get<ApiResponse<CustomersResponse>>(`/users${queryString ? `?${queryString}` : ''}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getUserById(accessToken: string | null, userId: string) {
  return fetchWrapper.get<ApiResponse<CustomerInfo>>(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
