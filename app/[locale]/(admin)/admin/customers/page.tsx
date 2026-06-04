import AdminPagination from '@/components/blocks/admin/AdminPagination';
import CustomersTable from '@/components/blocks/admin/CustomerTable';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { getUsers } from '@/services/user.service';

interface Props {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    search?: string;
    limit?: string;
  }>;
}

async function getUsersList(
  token: string,
  {
    page,
    limit,
    sort,
    search
  }: {
    page: number;
    limit: number;
    sort: string;
    search?: string;
  }
) {
  const res = await getUsers(token, {
    page,
    limit,
    // orderBy: (SORT_TO_ORDER_BY[sort] as OrderSort) ?? SORT_TO_ORDER_BY.newest,
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

  const currentSort = params.sort ?? 'newest';
  const currentSearch = params.search ?? '';

  const customersData = await getUsersList(token!, {
    page: currentPage,
    limit: currentLimit,
    sort: currentSort,
    search: currentSearch
  });

  return (
    <div className='space-y-4'>
      <TitlePage
        title='Quản lý khách hàng'
        subtitle='Quản lý thông tin khách hàng, lịch sử mua sắm và hoạt động gần đây.'
        button={{
          label: 'Thêm khách hàng',
          href: '/admin/customers/create'
        }}
      />

      <CustomersTable customers={customersData.data ?? []} currentSort={currentSort} />

      <AdminPagination
        pagination={{
          page: currentPage,
          limit: currentLimit,
          total: customersData.total,
          totalPages: customersData.totalPages
        }}
      />
    </div>
  );
}
