import { FetchWrapper } from '@/lib/fetch-wrapper';
import { SemanticProduct } from '@/types/discovery.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

/**
 * Tìm kiếm theo ngữ nghĩa — đi qua BFF, BFF gọi ai-service.
 * Khác `getProducts` (lọc theo từ khoá khớp chuỗi).
 */
export async function semanticSearch(query: string, limit = 8) {
  const params = new URLSearchParams({ query, limit: String(limit) });

  return fetchWrapper.get<ApiResponse<{ items: SemanticProduct[] }>>(
    `/products/semantic-search?${params.toString()}`,
    {}
  );
}

export async function getSimilarProducts(productId: string, limit = 8) {
  return fetchWrapper.get<ApiResponse<{ items: SemanticProduct[] }>>(
    `/products/${productId}/similar?limit=${limit}`,
    {}
  );
}

export async function reindexProducts(accessToken: string | null) {
  return fetchWrapper.post<ApiResponse<{ indexed: number }>>('/admin/products/reindex', null, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
