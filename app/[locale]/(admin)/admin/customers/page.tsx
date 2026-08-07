import AdminPagination from '@/components/blocks/admin/AdminPagination';
import CustomersTable from '@/components/blocks/admin/CustomerTable';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { routing } from '@/i18n/routing';
import { getToken } from '@/lib/auth';
import { getValidLimit, getValidPage } from '@/lib/utils';
import { getUsers } from '@/services/user.service';
import { setRequestLocale } from 'next-intl/server';

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
  const res = await getUsers(token, { page, limit, search: search || undefined });
  if (!res?.ok || !res?.data?.data) return { data: [], total: 0, page, limit, totalPages: 1 };
  return res.data.data;
}

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; sort?: string; search?: string; limit?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const token = await getToken();
  const sp = await searchParams;

  const currentPage = getValidPage(sp.page);
  const currentLimit = getValidLimit(sp.limit);
  const currentSort = sp.sort ?? 'newest';
  const currentSearch = sp.search ?? '';

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
        button={{ label: 'Thêm khách hàng', href: '/admin/customers/create' }}
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
