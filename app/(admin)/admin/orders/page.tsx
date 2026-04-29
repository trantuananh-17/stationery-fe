import OrdersTable from '@/components/blocks/admin/OrdersTable';
import { QueryTabs } from '@/components/blocks/admin/QueryTabs';
import TitlePage from '@/components/blocks/admin/TitlePage';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

export type Order = {
  id: string;
  number: string;
  customer: string;
  email: string;
  product: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
};

const orders: Order[] = [
  {
    id: '1',
    number: 'ORD-1001',
    customer: 'Nguyễn Minh Anh',
    email: 'minhanh@gmail.com',
    product: 'Bút bi Thiên Long',
    status: 'PENDING',
    createdAt: '2024-05-01',
    total: 125000
  },
  {
    id: '2',
    number: 'ORD-1002',
    customer: 'Trần Quốc Bảo',
    email: 'quocbao@gmail.com',
    product: 'Sổ tay A5',
    status: 'PROCESSING',
    createdAt: '2024-05-03',
    total: 285000
  },
  {
    id: '3',
    number: 'ORD-1003',
    customer: 'Lê Hoàng My',
    email: 'hoangmy@gmail.com',
    product: 'Giấy in Double A',
    status: 'PROCESSING',
    createdAt: '2024-05-04',
    total: 450000
  },
  {
    id: '4',
    number: 'ORD-1004',
    customer: 'Phạm Gia Huy',
    email: 'giahuy@gmail.com',
    product: 'Bìa hồ sơ nhựa',
    status: 'DELIVERED',
    createdAt: '2024-05-06',
    total: 98000
  },
  {
    id: '5',
    number: 'ORD-1005',
    customer: 'Đỗ Khánh Linh',
    email: 'khanhlinh@gmail.com',
    product: 'Máy tính Casio FX-580VN X',
    status: 'CANCELLED',
    createdAt: '2024-05-08',
    total: 785000
  },
  {
    id: '6',
    number: 'ORD-1006',
    customer: 'Nguyễn Thanh Tùng',
    email: 'thanhtung@gmail.com',
    product: 'Thước kẻ 30cm',
    status: 'CANCELLED',
    createdAt: '2024-05-09',
    total: 65000
  },
  {
    id: '7',
    number: 'ORD-1007',
    customer: 'Võ Mai Phương',
    email: 'maiphuong@gmail.com',
    product: 'Bộ bút màu 24 cây',
    status: 'DELIVERED',
    createdAt: '2024-05-10',
    total: 320000
  }
];

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = 'all' } = await searchParams;

  const filteredOrders = status === 'all' ? orders : orders.filter((order) => order.status.toLowerCase() === status);

  return (
    <div className='space-y-4'>
      <TitlePage title='Quản lý đơn hàng' subtitle='Browse and manage your product catalog.' />
      <QueryTabs
        queryKey='status'
        currentValue={status}
        items={[
          { label: 'Tất cả', value: 'all' },
          { label: 'Chờ xử lý', value: 'pending' },
          { label: 'Đang xử lý', value: 'processing' },
          { label: 'Đã giao', value: 'delivered' },
          { label: 'Đã hủy', value: 'cancelled' }
        ]}
      />
      <OrdersTable orders={filteredOrders} />
    </div>
  );
}
