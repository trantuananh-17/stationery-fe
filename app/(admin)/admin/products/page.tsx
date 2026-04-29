import ProductsDataTable from '@/components/blocks/admin/ProductsDataTable';
import { QueryTabs } from '@/components/blocks/admin/QueryTabs';
import TitlePage from '@/components/blocks/admin/TitlePage';

export type ProductStatus = 'active' | 'draft' | 'archived';

export type Product = {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  status: ProductStatus;
  stock: number;
  price: number;
  createdAt: string;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Pro Dashboard Template',
    description: 'Ipsum numquam nihil rerum omnis. Qui vero rerum et rerum minima aut.',
    sku: 'SKU-0001',
    category: 'Templates',
    status: 'active',
    stock: 999,
    price: 49,
    createdAt: 'Mar 07, 2026'
  },
  {
    id: '2',
    name: 'Analytics Widget Suite',
    description: 'Ut quidem corrupti reiciendis quia eius et voluptate corporis.',
    sku: 'SKU-0002',
    category: 'Widgets',
    status: 'archived',
    stock: 999,
    price: 79,
    createdAt: 'Mar 07, 2026'
  },
  {
    id: '3',
    name: 'Enterprise Admin Panel',
    description: 'Adipisci voluptatem dolore dolores ullam aut.',
    sku: 'SKU-0003',
    category: 'Templates',
    status: 'draft',
    stock: 500,
    price: 99,
    createdAt: 'Mar 07, 2026'
  }
];

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = 'all' } = await searchParams;

  const filteredProducts = status === 'all' ? products : products.filter((product) => product.status === status);

  await new Promise((resolve) => setTimeout(resolve, 1000));

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
        currentValue={status}
        items={[
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Draft', value: 'draft' },
          { label: 'Archived', value: 'archived' }
        ]}
      />

      <ProductsDataTable products={filteredProducts} />
    </div>
  );
}
