import CheckoutClient from '@/components/blocks/CheckoutClient';
import { CartItem } from '@/types/cart.type';

async function getCartItems(): Promise<CartItem[]> {
  return [
    {
      id: '1',
      name: 'Minimalist Beige Sneakers',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png',
      price: 120,
      quantity: 1,
      variant: 'Size: EU 36'
    },
    {
      id: '2',
      name: 'Embroidered Blue Top',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png',
      price: 140,
      quantity: 1,
      variant: 'Size: S'
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
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>Thanh Toán</h1>

        <CheckoutClient initialItems={items} />
      </div>
    </section>
  );
}
