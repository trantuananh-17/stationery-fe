import { FetchWrapper } from '@/lib/fetch-wrapper';
import { WishlistItem, WishlistItemInput } from '@/types/wishlist.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const authHeaders = (accessToken: string | null) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

export async function getWishlist(accessToken: string | null) {
  return fetchWrapper.get<ApiResponse<WishlistItem[]>>('/users/me/wishlist', authHeaders(accessToken));
}

export async function addWishlistItem(accessToken: string | null, data: WishlistItemInput) {
  return fetchWrapper.post<ApiResponse<{ productId: string; added: boolean }>>(
    '/users/me/wishlist',
    data,
    authHeaders(accessToken)
  );
}

export async function removeWishlistItem(accessToken: string | null, productId: string) {
  return fetchWrapper.delete<ApiResponse<{ productId: string }>>(
    `/users/me/wishlist/${productId}`,
    authHeaders(accessToken)
  );
}
