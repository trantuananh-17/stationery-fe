import CustomersTable from '@/components/blocks/admin/CustomerTable';
import { QueryTabs } from '@/components/blocks/admin/QueryTabs';
import TitlePage from '@/components/blocks/admin/TitlePage';
import { getValidLimit, getValidPage } from '@/lib/utils';

export type Customer = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  isActive: boolean;
  isVerified: boolean;
  orders: number;
  amountSpent: number;
  createdAt: string;
};

interface Props {
  searchParams: Promise<{
    page?: string;
    status?: string;
    sort?: string;
    search?: string;
    limit?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Nguyễn Minh Anh',
      firstName: 'Nguyễn Minh',
      lastName: 'Anh',
      email: 'minhanh@gmail.com',
      address: '12 Nguyễn Huệ, Quận 1, TP.HCM',
      isActive: true,
      isVerified: true,
      orders: 12,
      amountSpent: 4250000,
      createdAt: '2026-01-12'
    },
    {
      id: '2',
      name: 'Trần Quốc Bảo',
      firstName: 'Trần Quốc',
      lastName: 'Bảo',
      email: 'quocbao@gmail.com',
      address: '45 Lê Lợi, Quận 3, TP.HCM',
      isActive: false,
      isVerified: false,
      orders: 7,
      amountSpent: 2890000,
      createdAt: '2026-02-08'
    },
    {
      id: '3',
      name: 'Lê Hoàng My',
      firstName: 'Lê Hoàng',
      lastName: 'My',
      email: 'hoangmy@gmail.com',
      address: '88 Hai Bà Trưng, Hà Nội',
      isActive: true,
      isVerified: true,
      orders: 19,
      amountSpent: 8320000,
      createdAt: '2026-03-21'
    },
    {
      id: '4',
      name: 'Phạm Gia Huy',
      firstName: 'Phạm Gia',
      lastName: 'Huy',
      email: 'giahuy@gmail.com',
      address: '102 Trần Phú, Đà Nẵng',
      isActive: false,
      isVerified: false,
      orders: 4,
      amountSpent: 1540000,
      createdAt: '2026-04-15'
    },
    {
      id: '5',
      name: 'Đỗ Khánh Linh',
      firstName: 'Đỗ Khánh',
      lastName: 'Linh',
      email: 'khanhlinh@gmail.com',
      address: '21 Võ Văn Tần, TP.HCM',
      isActive: true,
      isVerified: true,
      orders: 10,
      amountSpent: 3760000,
      createdAt: '2026-05-03'
    }
  ];

  const params = await searchParams;

  const currentPage = getValidPage(params.page);
  const currentLimit = getValidLimit(params.limit);

  console.log(params);

  const currentSort = params.sort ?? 'newest';
  const currentSearch = params.search ?? '';

  return (
    <div className='space-y-4'>
      <TitlePage
        title='Quản lý khách hàng'
        subtitle='Browse and manage your product catalog.'
        button={{
          label: 'Thêm khách hàng',
          href: '/admin/customers/create'
        }}
      />

      <CustomersTable customers={customers} currentSort={currentSort} />
    </div>
  );
}
