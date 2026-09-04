import { FetchWrapper } from '@/lib/fetch-wrapper';
import { GetInventoriesResponse } from '@/types/inventory.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const authHeaders = (accessToken: string | null) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

export type GetInventoriesParams = {
  search?: string;
  lowStockThreshold?: number;
  page?: number;
  limit?: number;
};

export async function getInventories(accessToken: string | null, params?: GetInventoriesParams) {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.lowStockThreshold !== undefined) {
    searchParams.set('lowStockThreshold', String(params.lowStockThreshold));
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetInventoriesResponse>>(
    `/admin/inventories${queryString ? `?${queryString}` : ''}`,
    authHeaders(accessToken)
  );
}

export async function adjustStock(accessToken: string | null, variantId: string, stock: number) {
  return fetchWrapper.patch<ApiResponse<{ variantId: string; stock: number; reservedStock: number }>>(
    `/admin/inventories/${variantId}/stock`,
    { stock },
    authHeaders(accessToken)
  );
}
