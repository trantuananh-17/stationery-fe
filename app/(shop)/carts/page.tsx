import CartClient from '@/components/blocks/CartClient';
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
    },
    {
      id: '3',
      name: 'Classic Fedora Hat',
      image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png',
      price: 84,
      quantity: 1,
      variant: 'Color: Beige'
    }
  ];
}

export default async function page() {
  const items = await getCartItems();

  return (
    <section className='py-8 lg:py-12'>
      <div className='container'>
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>Giỏ Hàng</h1>

        <CartClient initialItems={items} />
      </div>
    </section>
  );
}
