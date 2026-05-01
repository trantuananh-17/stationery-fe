import { CircleCheck } from 'lucide-react';

import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import ProductDescription from '@/components/blocks/ProductDescription';
import ProductInfo from '@/components/blocks/ProductInfo';
import ProductReview from '@/components/blocks/ProductReview';
import Reviews from '@/components/blocks/Reviews';
import RelatedProduct from '@/components/blocks/RelatedProduct';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import ProductImages from './ProductImages';
import ProductPurchaseForm from './ProductPurchaseForm';
import { Product } from '@/types/product.type';

interface ProductDetailProps {
  product: Product;
  className?: string;
}

export default async function ProductDetail({ product, className }: ProductDetailProps) {
  const defaultVariant = product.variants.find((item) => item.isDefault) ?? product.variants[0];

  const isInStock = product.variants.some((item) => item.isAvailable && item.stock > 0);

  const reviews = {
    rate: 0,
    totalReviewers: 0
  };

  return (
    <>
      <section className='py-4 md:py-8'>
        <BreadcrumbSection />
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
                    <h1 className='text-xl font-bold tracking-tight lg:text-3xl'>{product.name}</h1>

                    <div className='mt-3 flex flex-wrap items-center gap-4'>
                      <Reviews rate={reviews.rate} totalReviewers={reviews.totalReviewers} />

                      <Badge variant='secondary'>
                        <CircleCheck />
                        {isInStock ? 'Còn hàng' : 'Hết hàng'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <ProductPurchaseForm
                productId={product.id}
                shortDescription={product.shortDescription}
                variants={product.variants}
                variantOptions={product.variantOptions}
                selected={{
                  variantId: defaultVariant?.id,
                  quantity: 1
                }}
              />

              <ProductInfo category={product.category} brand={product.brand} specifications={product.specifications} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 py-4'>
            <Separator />

            <ProductDescription className='md:pr-2' description={product.description} />

            <Separator />

            <ProductReview className='' {...reviews} />
          </div>
        </div>
      </section>

      <RelatedProduct />
    </>
  );
}
