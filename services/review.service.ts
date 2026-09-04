import { FetchWrapper } from '@/lib/fetch-wrapper';
import { GetReviewsResponse, ReviewFormValues } from '@/types/review.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const authHeaders = (accessToken: string | null) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

export async function getReviews(productId: string, params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetReviewsResponse>>(
    `/products/${productId}/reviews${queryString ? `?${queryString}` : ''}`,
    {}
  );
}

export async function createReview(accessToken: string | null, productId: string, data: ReviewFormValues) {
  return fetchWrapper.post<ApiResponse<{ reviewId: string }>>(
    `/products/${productId}/reviews`,
    data,
    authHeaders(accessToken)
  );
}

export async function deleteReview(accessToken: string | null, productId: string) {
  return fetchWrapper.delete<ApiResponse<{ productId: string }>>(
    `/products/${productId}/reviews`,
    authHeaders(accessToken)
  );
}
