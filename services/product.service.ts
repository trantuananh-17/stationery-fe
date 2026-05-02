import { FetchWrapper } from '@/lib/fetch-wrapper';
import { Product, ProductFormValues, ProductItem, UpdateProductFormValues } from '@/types/product.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export type ProductOrderBy =
  | 'price_asc'
  | 'price_desc'
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc';

export type AdminProductOrderBy =
  | 'price_asc'
  | 'price_desc'
  | 'created_at_desc'
  | 'created_at_asc'
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc';

export type AdminProductStatus = 'active' | 'draft' | 'archived';

export type GetProductsParams = {
  search?: string;
  category?: string;
  brand?: string;
  orderBy?: ProductOrderBy;
  page?: number;
  limit?: number;
};

export type GetAdminProductsParams = {
  search?: string;
  status?: AdminProductStatus;
  orderBy?: AdminProductOrderBy;
  page?: number;
  limit?: number;
};

export type GetProductsResponse = {
  items: ProductItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getProductBySlug(slug: string) {
  return fetchWrapper.get<ApiResponse<Product>>(`/products/slug/${slug}`, {});
}

export async function getProducts(params?: GetProductsParams) {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.category) {
    searchParams.set('category', params.category);
  }

  if (params?.brand) {
    searchParams.set('brand', params.brand);
  }

  if (params?.orderBy) {
    searchParams.set('orderBy', params.orderBy);
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetProductsResponse>>(`/products${queryString ? `?${queryString}` : ''}`, {});
}

export async function getAdminProducts(params?: GetAdminProductsParams) {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.status) {
    searchParams.set('status', params.status);
  }

  if (params?.orderBy) {
    searchParams.set('orderBy', params.orderBy);
  }

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  const queryString = searchParams.toString();

  return fetchWrapper.get<ApiResponse<GetProductsResponse>>(
    `/admin/products${queryString ? `?${queryString}` : ''}`,
    {}
  );
}

export async function getAdminProductById(id: string) {
  return fetchWrapper.get<ApiResponse<Product>>(`/products/id/${id}`, {});
}

export async function createAdminProduct(data: ProductFormValues) {
  return fetchWrapper.post<ApiResponse<Product>>(`/products`, data);
}

export async function updateAdminProduct(productId: string, data: UpdateProductFormValues) {
  return fetchWrapper.patch<ApiResponse<Product>>(`/products/${productId}`, data);
}
