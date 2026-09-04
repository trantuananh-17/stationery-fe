import { CircleCheck, CircleX } from 'lucide-react';

import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import ProductDescription from '@/components/blocks/ProductDescription';
import ProductInfo from '@/components/blocks/ProductInfo';
import ProductReviewSection from '@/components/blocks/ProductReviewSection';
import Reviews from '@/components/blocks/Reviews';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import ProductImages from './ProductImages';
import ProductPurchaseForm from './ProductPurchaseForm';
import WishlistButton from '@/components/blocks/WishlistButton';
import RecentlyViewed from '@/components/blocks/RecentlyViewed';
import CompareButton from '@/components/blocks/CompareButton';
import SimilarProducts from '@/components/blocks/SimilarProducts';
import { Product } from '@/types/product.type';
import { getReviews } from '@/services/review.service';

interface ProductDetailProps {
  product: Product;
  className?: string;
}

export default async function ProductDetail({ product, className }: ProductDetailProps) {
  const defaultVariant = product.variants.find((item) => item.isDefault) ?? product.variants[0];

  const isInStock = product.variants.some((item) => item.isAvailable && item.stock > 0);

  // Lấy sẵn điểm trung bình phía server cho phần sao cạnh tên sản phẩm;
  // danh sách đánh giá do ProductReviewSection tự tải phía client.
  const reviewsResponse = await getReviews(product.id, { limit: 1 });
  const summary = reviewsResponse.data?.data?.summary ?? { average: 0, count: 0 };

  const reviews = {
    rate: summary.average,
    totalReviewers: summary.count
  };

  return (
    <>
      <section className='py-4 md:py-8'>
        <BreadcrumbSection
          title={product.name}
          breadcrumbs={{
            parent: {
              label: product.category.name,
              href: `/products?category=${product.category.slug}`
            }
          }}
        />
      </section>

      <section className={cn('', className)}>
        <div>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            <div>
              <ProductImages thumbnail={product.thumbnail} images={product.images} name={product.name} />
            </div>

            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h1 data-testid='product-name' className='text-xl font-bold tracking-tight lg:text-3xl'>
                      {product.name}
                    </h1>

                    <div className='mt-3 flex flex-wrap items-center gap-4'>
                      <Reviews rate={reviews.rate} totalReviewers={reviews.totalReviewers} />

                      <Badge variant={isInStock ? 'default' : 'destructive'}>
                        {isInStock ? <CircleCheck className='mr-1 h-4 w-4' /> : <CircleX className='mr-1 h-4 w-4' />}
                        {isInStock ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-muted-foreground text-xs md:text-sm'>{product.shortDescription}</p>

              <div className='flex items-end gap-2'>
                <ProductPurchaseForm
                  productId={product.id}
                  variants={product.variants}
                  variantOptions={product.variantOptions}
                  selected={{
                    variantId: defaultVariant?.id,
                    quantity: 1
                  }}
                />

                <WishlistButton
                  product={{
                    productId: product.id,
                    productName: product.name,
                    productSlug: product.slug,
                    thumbnail: product.thumbnail,
                    price: defaultVariant?.price ?? 0
                  }}
                />

                <CompareButton
                  className='flex items-center gap-1'
                  product={{ productId: product.id, slug: product.slug, name: product.name }}
                />
              </div>

              <ProductInfo category={product.category} brand={product.brand} specifications={product.specifications} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 py-4'>
            <Separator />

            <ProductDescription className='md:pr-2' description={product.description} />

            <Separator />

            <SimilarProducts productId={product.id} />

            <ProductReviewSection productId={product.id} />

            <Separator />

            <RecentlyViewed
              current={{
                productId: product.id,
                name: product.name,
                slug: product.slug,
                thumbnail: product.thumbnail,
                price: defaultVariant?.price ?? 0
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
