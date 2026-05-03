import CheckoutClient from '@/components/blocks/CheckoutClient';
import { CartItem } from '@/stores/cart-store';

async function getCartItems(): Promise<CartItem[]> {
  return [
    {
      id: 'a1863e2a-a554-4c4d-8f30-42aab3260b00',
      cartId: 'f82996cc-2cd2-4d58-9311-940fbbb27f73',
      productId: '4d24f89c-bb11-4c6d-b836-6e307bccaf90',
      variantId: 'cfdeece9-d138-46af-9b62-ba319108c8ee',
      quantity: 10,
      productNameSnapshot: 'Bút Bi Bấm I-5 0.5 mm – Radius – Mực Đen',
      productSlugSnapshot: 'but-bi-bam-i-5-05-mm-radius-muc-den-1',
      variantNameSnapshot: 'Đỏ',
      skuSnapshot: 'BUT-RE-VAR-42E4F6',
      productThumbnailSnapshot:
        'https://vanphongphamminaco.com/wp-content/uploads/2023/10/but-bi-bam-i-5-0-5-mm-radius-muc-den.webp',
      imageVariantSnapshot: '',
      unitPriceSnapshot: 2000,
      compareAtPriceSnapshot: 0,
      attributesSnapshot: [
        {
          name: 'Màu sắc',
          value: 'Đỏ'
        }
      ],
      subtotal: 4000,
      createdAt: {
        seconds: {
          low: 1777712580,
          high: 0,
          unsigned: false
        },
        nanos: 295000000
      },
      updatedAt: {
        seconds: {
          low: 1777812786,
          high: 0,
          unsigned: false
        },
        nanos: 754000000
      }
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
