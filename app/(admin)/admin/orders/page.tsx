import AdminPagination from '@/components/blocks/admin/AdminPagination';
import OrdersTable from '@/components/blocks/admin/OrdersTable';
import { QueryTabs } from '@/components/blocks/admin/QueryTabs';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { getOrders } from '@/services/order.service';
import { OrderStatus } from '@/types/order.type';

export type OrderSort = 'price_asc' | 'price_desc' | 'created_at_asc' | 'created_at_desc';

const SORT_TO_ORDER_BY: Record<string, OrderSort> = {
  newest: 'created_at_desc',
  oldest: 'created_at_asc',

  price_asc: 'price_asc',
  price_desc: 'price_desc',

  created_at_asc: 'created_at_asc',
  created_at_desc: 'created_at_desc'
};

function isOrderStatus(value?: string): value is OrderStatus {
  return (
    value === 'pending' ||
    value === 'processing' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'cancelled'
  );
}

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    search?: string;
    limit?: string;
  }>;
}

async function getOrdersList(
  token: string,
  {
    page,
    limit,
    sort,
    status,
    search
  }: {
    page: number;
    limit: number;
    sort: string;
    status: string;
    search?: string;
  }
) {
  const res = await getOrders(token, {
    page,
    limit,
    // orderBy: (SORT_TO_ORDER_BY[sort] as OrderSort) ?? SORT_TO_ORDER_BY.newest,
    status: isOrderStatus(status) ? status : undefined,
    search: search || undefined
  });
  if (!res?.ok || !res?.data?.data) {
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 1
    };
  }

  console.log(res.data.data);

  return res.data.data;
}

export default async function Page({ searchParams }: Props) {
  const token = await getToken();
  const params = await searchParams;

  const currentPage = getValidPage(params.page);
  const currentLimit = getValidLimit(params.limit);

  const currentStatus = params.status ?? 'all';
  const currentSort = params.sort ?? 'newest';
  const currentSearch = params.search ?? '';

  const ordersData = await getOrdersList(token!, {
    page: currentPage,
    limit: currentLimit,
    sort: currentSort,
    status: currentStatus,
    search: currentSearch
  });

  return (
    <div className='space-y-4'>
      <TitlePage title='Quản lý đơn hàng' subtitle='Browse and manage customer orders.' />

      <OrdersTable orders={ordersData.data ?? []} currentSort={currentSort} currentStatus={currentStatus} />

      <AdminPagination
        pagination={{
          page: currentPage,
          limit: currentLimit,
          total: ordersData.total,
          totalPages: ordersData.totalPages
        }}
      />
    </div>
  );
}
