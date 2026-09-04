import { FetchWrapper } from '@/lib/fetch-wrapper';
import { Address, AddressFormValues } from '@/types/address.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

const authHeaders = (accessToken: string | null) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

export async function getAddresses(accessToken: string | null) {
  return fetchWrapper.get<ApiResponse<Address[]>>('/users/me/addresses', authHeaders(accessToken));
}

export async function createAddress(accessToken: string | null, data: AddressFormValues) {
  return fetchWrapper.post<ApiResponse<Address>>('/users/me/addresses', data, authHeaders(accessToken));
}

export async function updateAddress(accessToken: string | null, addressId: string, data: AddressFormValues) {
  return fetchWrapper.put<ApiResponse<Address>>(`/users/me/addresses/${addressId}`, data, authHeaders(accessToken));
}

export async function setDefaultAddress(accessToken: string | null, addressId: string) {
  return fetchWrapper.patch<ApiResponse<Address>>(
    `/users/me/addresses/${addressId}/default`,
    null,
    authHeaders(accessToken)
  );
}

export async function deleteAddress(accessToken: string | null, addressId: string) {
  return fetchWrapper.delete<ApiResponse<{ addressId: string }>>(
    `/users/me/addresses/${addressId}`,
    authHeaders(accessToken)
  );
}
