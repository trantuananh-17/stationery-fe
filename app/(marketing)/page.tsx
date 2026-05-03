import Banner from '@/components/blocks/Banner';
import BestPriceSection from '@/components/blocks/BestPriceSection';
import BrandCollection from '@/components/blocks/BrandCollection';
import CategoryList from '@/components/blocks/CategoryList';
import ProductShowCase from '@/components/blocks/ProductShowCase';
import StoreDescriptionSection from '@/components/blocks/StoreDescriptionSection';
import { getProducts } from '@/services/product.service';
import PEN from '@/assets/images/pen-banner-img.jpg';
import SHELF from '@/assets/images/ke-banner-img.webp';
import PaymentToast from '@/components/blocks/PaymentToast';
import { Suspense } from 'react';

async function getFeaturedProducts() {
  const res = await getProducts({
    page: 1,
    limit: 6,
    orderBy: 'price_asc'
  });

  if (!res?.ok || !res?.data?.data) {
    return [];
  }

  return res.data.data.items;
}

async function getPenProducts() {
  const res = await getProducts({
    category: 'but-bi-but-bi-nuoc',
    page: 1,
    limit: 5,
    orderBy: 'price_asc'
  });

  if (!res?.ok || !res?.data?.data) {
    return [];
  }

  return res.data.data.items;
}

async function getPaperProducts() {
  const res = await getProducts({
    category: 'giay',
    page: 1,
    limit: 5,
    orderBy: 'price_asc'
  });

  if (!res?.ok || !res?.data?.data) {
    return [];
  }

  return res.data.data.items;
}

async function getThienLongProducts() {
  const res = await getProducts({
    brand: 'thien-long',
    page: 1,
    limit: 6,
    orderBy: 'price_asc'
  });

  if (!res?.ok || !res?.data?.data) {
    return [];
  }

  return res.data.data.items;
}

export default async function Home() {
  const [featuredProducts, penProducts, paperProducts, thienLongProducts] = await Promise.all([
    getFeaturedProducts(),
    getPenProducts(),
    getPaperProducts(),
    getThienLongProducts()
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <PaymentToast />
      </Suspense>

      <Banner />

      <CategoryList />

      <ProductShowCase
        image={PEN}
        products={penProducts}
        title='Bút các loại'
        subtitle='Viết êm - giá tốt'
        link={{
          href: '/products?category=but-bi-but-bi-nuoc&orderBy=price_asc',
          target: '_self'
        }}
      />

      <BestPriceSection products={featuredProducts} />

      <div className='py-4 md:py-8'>
        <BrandCollection />

        <BestPriceSection products={thienLongProducts} showHeader={false} className='py-0 md:py-0' />
      </div>

      <ProductShowCase
        image={SHELF}
        products={paperProducts}
        title='Giấy văn phòng'
        subtitle='Trắng đẹp - mềm mịn'
        link={{
          href: '/products?category=giay&orderBy=price_asc',
          target: '_self'
        }}
      />

      <StoreDescriptionSection />
    </>
  );
}
