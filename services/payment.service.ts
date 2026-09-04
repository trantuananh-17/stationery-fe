import { FetchWrapper } from '@/lib/fetch-wrapper';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export type CreatePaymentIntentPayload = {
  orderId: string;
};

export type CreatePaymentIntentResponse = {
  orderId: string;
  clientEmail: string;
  totalItem: number;
  totalPrice: number;
  subTotal: number;
  shippingCost: number;
  clientSecret: string;
  paymentIntentId: string;
};

export async function createPaymentIntent(accessToken: string, payload: CreatePaymentIntentPayload) {
  console.log('hello');

  return fetchWrapper.post<ApiResponse<CreatePaymentIntentResponse>>('/payments/create-intent', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
