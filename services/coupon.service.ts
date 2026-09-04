import { FetchWrapper } from '@/lib/fetch-wrapper';
import { CouponFormValues, Coupon, GetCouponsResponse, ValidatedCoupon } from '@/types/coupon.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const authHeaders = (accessToken: string | null) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

export async function validateCoupon(accessToken: string | null, code: string, subtotal: number) {
  return fetchWrapper.post<ApiResponse<ValidatedCoupon>>(
    '/coupons/validate',
    { code, subtotal },
    authHeaders(accessToken)
  );
}

export async function getCoupons(
  accessToken: string | null,
  params?: { search?: string; page?: number; limit?: number }
) {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetCouponsResponse>>(
    `/admin/coupons${queryString ? `?${queryString}` : ''}`,
    authHeaders(accessToken)
  );
}

export async function createCoupon(accessToken: string | null, data: CouponFormValues) {
  return fetchWrapper.post<ApiResponse<Coupon>>('/admin/coupons', data, authHeaders(accessToken));
}

export async function updateCoupon(accessToken: string | null, couponId: string, data: CouponFormValues) {
  return fetchWrapper.put<ApiResponse<Coupon>>(`/admin/coupons/${couponId}`, data, authHeaders(accessToken));
}

export async function deleteCoupon(accessToken: string | null, couponId: string) {
  return fetchWrapper.delete<ApiResponse<{ couponId: string }>>(
    `/admin/coupons/${couponId}`,
    authHeaders(accessToken)
  );
}

export type ShippingQuote = {
  fee: number;
  freeThreshold: number;
};

/** Phí ship do server quyết định; FE chỉ hiển thị lại cho khớp. */
export async function getShippingQuote(amount: number) {
  return fetchWrapper.get<ApiResponse<ShippingQuote>>(`/shipping/quote?amount=${amount}`, {});
}
