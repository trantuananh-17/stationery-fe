import { FetchWrapper } from '@/lib/fetch-wrapper';
import { Product } from '@/types/product.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function getProductBySlug(slug: string) {
  return fetchWrapper.get<ApiResponse<Product>>(`/products/slug/${slug}`, {});
}
