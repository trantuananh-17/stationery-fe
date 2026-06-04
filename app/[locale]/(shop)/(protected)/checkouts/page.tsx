import { redirect } from 'next/navigation';

import CheckoutClient from '@/components/blocks/CheckoutClient';
import { getToken } from '@/lib/auth';
import { getCart } from '@/services/cart.service';
import { CartItem } from '@/stores/cart-store';

async function getCartItems(token?: string | null): Promise<CartItem[]> {
  const response = await getCart(token, null);

  if (!response.data?.data) {
    return [];
  }

  return response.data?.data?.items ?? [];
}

export default async function Page() {
  const token = await getToken();

  if (!token) {
    redirect('/');
  }

  const items = await getCartItems(token);

  // cart rỗng
  if (!items.length) {
    redirect('/');
  }

  return (
    <section className='py-8 lg:py-12'>
      <div className='container'>
        <h1 className='mb-4 text-2xl font-semibold lg:text-3xl'>Thanh Toán</h1>

        <CheckoutClient initialItems={items} />
      </div>
    </section>
  );
}
