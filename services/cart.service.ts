import { FetchWrapper } from '@/lib/fetch-wrapper';
import type { Cart } from '@/stores/cart-store';

type ApiResponse<T> = {
  message: string;
  statusCode: number;
  data: T;
  processID: string;
  duration: string;
};

export type CartTotal = {
  totalItems: number;
  totalUniqueItems: number;
  subtotal: number;
};

export type CartCount = {
  count: number;
};

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const getCartHeaders = (accessToken?: string | null, sessionId?: string | null) => {
  if (accessToken) {
    return {
      Authorization: `Bearer ${accessToken}`
    };
  }

  if (sessionId) {
    return {
      'x-session-id': sessionId
    };
  }

  return undefined;
};

export async function getCart(accessToken?: string | null, sessionId?: string | null) {
  return fetchWrapper.get<ApiResponse<Cart>>('/cart', {
    headers: getCartHeaders(accessToken, '550e8400-e29b-41d4-a716-446655440000')
  });
}

export async function getCartCount(accessToken?: string | null, sessionId?: string | null) {
  return fetchWrapper.get<ApiResponse<CartCount>>('/cart/count', {
    headers: getCartHeaders(accessToken, '550e8400-e29b-41d4-a716-446655440000')
  });
}

export async function addToCart(
  variantId: string,
  quantity: number,
  accessToken?: string | null,
  sessionId?: string | null
) {
  return fetchWrapper.post<ApiResponse<null>>(
    `/cart/add`,
    {
      variantId,
      quantity
    },
    {
      headers: getCartHeaders(accessToken, '550e8400-e29b-41d4-a716-446655440000')
    }
  );
}

export async function updateCartItemQuantity(
  variantId: string,
  quantity: number,
  accessToken?: string | null,
  sessionId?: string | null
) {
  return fetchWrapper.put<ApiResponse<null>>(
    `/cart/items/${variantId}`,
    {
      quantity
    },
    {
      headers: getCartHeaders(accessToken, '550e8400-e29b-41d4-a716-446655440000')
    }
  );
}

export async function removeCartItem(cartItemId: string, accessToken?: string | null, sessionId?: string | null) {
  return fetchWrapper.delete<ApiResponse<null>>(`/cart/items/${cartItemId}`, {
    headers: getCartHeaders(accessToken, '550e8400-e29b-41d4-a716-446655440000')
  });
}
