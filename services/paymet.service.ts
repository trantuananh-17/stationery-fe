import { FetchWrapper } from '@/lib/fetch-wrapper';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_PAYMENT_API as string);

export type CreatePaymentIntentPayload = {
  orderId: string;
  clientEmail: string;
  lineItems: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

export type CreatePaymentIntentResponse = {
  data: {
    clientSecret: string;
    paymentIntentId: string;
  };
  message: string;
  statusCode: number;
};

export async function createPaymentIntent(accessToken: string, payload: CreatePaymentIntentPayload) {
  return fetchWrapper.post<CreatePaymentIntentResponse>('/payments/payment-intent', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
