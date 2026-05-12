import { FetchWrapper } from '@/lib/fetch-wrapper';
import { grpcTimestampToDate, parseDate } from '@/lib/utils';
import { GetNotificationsParams, GetNotificationsRes, UnReadCountRes } from '@/types/notification.type';
import { ApiResponse } from '@/types/type';

const fetchWrapper = new FetchWrapper(process.env.NEXT_PUBLIC_SERVER_API as string);

export async function getUnReadCount(accessToken: string | null) {
  return fetchWrapper.get<ApiResponse<UnReadCountRes>>('/notifications/unread-count', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function getNotifications(
  accessToken: string | null,

  params?: GetNotificationsParams
) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }

  if (params?.status) {
    searchParams.set('status', params.status);
  }

  if (params?.type) {
    searchParams.set('type', params.type);
  }

  const query = searchParams.toString();

  const response = await fetchWrapper.get<ApiResponse<GetNotificationsRes>>(
    `/notifications${query ? `?${query}` : ''}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...response?.data?.data,
        items: (response?.data?.data?.items ?? []).map((item) => ({
          ...item,
          createdAt: parseDate(item.createdAt) ?? new Date(),
          updatedAt: parseDate(item.updatedAt) ?? new Date(),
          readAt: parseDate(item.readAt)
        }))
      }
    }
  };
}

export async function markNotificationAsRead(
  accessToken: string | null,

  notificationId: string
) {
  return fetchWrapper.patch<ApiResponse<null>>(`/notifications/${notificationId}/read`, undefined, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function markAllNotificationsAsRead(accessToken: string | null) {
  return fetchWrapper.patch<ApiResponse<null>>('/notifications/read-all', undefined, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}
