import CheckoutClient from '@/components/blocks/CheckoutClient';
import { CartItem } from '@/types/cart.type';

async function getCartItems(): Promise<CartItem[]> {
  return [
    {
      id: '1',
      name: 'Giấy in ảnh A4 1 mặt Kim Mai ĐL 135',
      image: 'https://vanphongphamminaco.com/wp-content/uploads/2023/06/Giay-in-anh-A4-1-mat-Kim-Mai-DL-135-3.webp',
      price: 60400,
      quantity: 1,
      variant: ''
    },
    {
      id: '2',
      name: 'Bút nước Acumen 0.7mm',
      image: 'https://vanphongphamminaco.com/wp-content/uploads/2023/06/But-nuoc-Acumen-0.7mm.webp',
      price: 7500,
      quantity: 10
    }
  ];
}

export default async function page() {
  const items = await getCartItems();
  return (
    <section className='py-8 lg:py-12'>
      <div className='container'>
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>Thanh Toán</h1>

        <CheckoutClient initialItems={items} />
      </div>
    </section>
  );
}
