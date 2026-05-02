import ProductsDataTable from '@/components/blocks/admin/ProductsDataTable';
import { QueryTabs } from '@/components/blocks/admin/QueryTabs';
import TitlePage from '@/components/blocks/admin/TitlePage';
import PaginationSection from '@/components/blocks/PaginationSection';
import { AdminProductStatus, getAdminProducts } from '@/services/product.service';

export type AdminProductOrderBy =
  | 'name_asc'
  | 'name_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'price_asc'
  | 'price_desc'
  | 'created_at_asc'
  | 'created_at_desc';

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    search?: string;
  }>;
}

const DEFAULT_LIMIT = 15;

const SORT_TO_ORDER_BY: Record<string, AdminProductOrderBy> = {
  newest: 'created_at_desc',
  oldest: 'created_at_asc',

  name_asc: 'name_asc',
  name_desc: 'name_desc',

  stock_asc: 'stock_asc',
  stock_desc: 'stock_desc',

  price_asc: 'price_asc',
  price_desc: 'price_desc',

  created_at_asc: 'created_at_asc',
  created_at_desc: 'created_at_desc'
};

function isProductStatus(value?: string): value is AdminProductStatus {
  return value === 'active' || value === 'draft' || value === 'archived';
}

function getValidPage(value?: string) {
  const page = Number(value ?? 1);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

async function getProductList({
  page,
  sort,
  status,
  search
}: {
  page: number;
  sort: string;
  status: string;
  search?: string;
}) {
  const res = await getAdminProducts({
    page,
    limit: DEFAULT_LIMIT,
    orderBy: SORT_TO_ORDER_BY[sort] ?? SORT_TO_ORDER_BY.newest,
    status: isProductStatus(status) ? status : undefined,
    search: search || undefined
  });

  if (!res?.ok || !res?.data?.data) {
    return {
      items: [],
      total: 0,
      page,
      limit: DEFAULT_LIMIT,
      totalPages: 1
    };
  }

  return res.data.data;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = getValidPage(params.page);
  const currentStatus = params.status ?? 'all';
  const currentSort = params.sort ?? 'newest';
  const currentSearch = params.search ?? '';

  const productsData = await getProductList({
    page: currentPage,
    sort: currentSort,
    status: currentStatus,
    search: currentSearch
  });

  return (
    <div className='space-y-4'>
      <TitlePage
        title='Quản lý sản phẩm'
        subtitle='Browse and manage your product catalog.'
        button={{
          label: 'Thêm sản phẩm',
          href: '/admin/products/create'
        }}
      />

      <QueryTabs
        queryKey='status'
        currentValue={currentStatus}
        items={[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Draft', value: 'draft' },
          { label: 'Archived', value: 'archived' }
        ]}
      />

      <ProductsDataTable products={productsData.items ?? []} currentSort={currentSort} />

      <PaginationSection
        currentPage={productsData.page}
        totalPages={productsData.totalPages}
        basePath='/admin/products'
        searchParams={params}
      />
    </div>
  );
}
