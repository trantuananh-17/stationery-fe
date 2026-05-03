import { ApiResponse } from '@/types/type';
import { FetchWrapper } from '@/lib/fetch-wrapper';
import { CheckoutFormValues } from '@/types/checkout.type';
import { CheckoutResult } from '@/types/order.type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function createOrder(accessToken: string | null, data: CheckoutFormValues) {
  return fetchWrapper.post<ApiResponse<CheckoutResult>>(`/orders/checkout`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
