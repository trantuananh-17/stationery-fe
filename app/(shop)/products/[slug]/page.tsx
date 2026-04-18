'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleCheck } from 'lucide-react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import BreadcrumbSection from '@/components/blocks/BreadcrumbSection';
import ProductDescription from '@/components/blocks/ProductDescription';
import ProductInfo from '@/components/blocks/ProductInfo';
import { ProductPrice } from '@/components/blocks/ProductPrice';
import ProductReview from '@/components/blocks/ProductReview';
import Reviews from '@/components/blocks/Reviews';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import ProductList from '@/components/blocks/ProductList';
import RelatedProduct from '@/components/blocks/RelatedProduct';

type StockStatusCode = 'IN_STOCK' | 'OUT_OF_STOCK';

interface StockInfo {
  stockStatusCode?: StockStatusCode;
  stockQuantity?: number;
}

type option = {
  id: string;
  label: string;
  stockInfo: StockInfo;
  color?: string;
  value: string;
};

interface Hinges {
  label: string;
  id: string;
  name: FieldName;
  options?: option[];
  min?: number;
  max?: number;
}

interface ProductImagesProps {
  images: Array<{
    srcset: string;
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes: string;
  }>;
}

type FormType = z.infer<typeof formSchema>;
type FieldName = keyof FormType;

type SizeOptionProps = option;

interface RadioGroupProps {
  options?: Array<option>;
  field: ControllerRenderProps<FormType>;
}

interface ProductFormProps {
  hinges?: Record<FieldName, Hinges>;
  selected: FormType;
}

const PRODUCT_DETAILS = {
  name: 'Urban Chill Jacket',
  color: 'blue',
  size: 'm',
  reviews: {
    rate: 4.5,
    totalReviewers: 0
  },
  description:
    'This denim puffer jacket blends warmth and street style, featuring tonal blue shades for a distinctive look thats both bold and versatile. Designed for comfort in any seasondistinctive look thats both bold and versatile. Designed for comfort in any season.',
  price: {
    regular: 300000,
    sale: 200000,
    currency: 'USD'
  },
  hinges: {
    size: {
      label: 'Select size',
      id: 'size',
      name: 'size',
      options: [
        {
          id: 'xs',
          label: 'xs',
          value: 'xs',
          stockInfo: {
            stockStatusCode: 'OUT_OF_STOCK'
          }
        },
        {
          id: 's',
          label: 's',
          value: 's',
          stockInfo: {
            stockStatusCode: 'OUT_OF_STOCK'
          }
        },
        {
          id: 'm',
          label: 'm',
          value: 'm',
          stockInfo: {
            stockStatusCode: 'IN_STOCK'
          }
        },
        {
          id: 'l',
          label: 'l',
          value: 'l',
          stockInfo: {
            stockStatusCode: 'IN_STOCK'
          }
        },
        {
          id: 'xl',
          label: 'xl',
          value: 'xl',
          stockInfo: {
            stockStatusCode: 'IN_STOCK'
          }
        }
      ]
    }
  } as Record<FieldName, Hinges>,
  images: [
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764033-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-2.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764699-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764036-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    },
    {
      srcset:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg 1920w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-2.jpg 1280w, https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-1.jpg 640w',
      src: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/pexels-cottonbro-6764040-3.jpg',
      alt: '',
      width: 1920,
      height: 2880,
      sizes: '(min-width: 1920px) 1920px, (min-width: 1280px) 1280px, 100vw'
    }
  ]
};

interface ProductDetailProps {
  className?: string;
}

const ProductDetail = ({ className }: ProductDetailProps) => {
  return (
    <DefaultLayout>
      <section className='py-4 md:py-8'>
        <BreadcrumbSection />
      </section>

      <section className={cn('', className)}>
        <div className='container'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12'>
            <div>
              <ProductImages images={PRODUCT_DETAILS.images} />
            </div>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                  <div className='flex-1'>
                    <h1 className='text-xl font-bold tracking-tight lg:text-3xl'>{PRODUCT_DETAILS.name}</h1>
                    <div className='mt-3 flex flex-wrap items-center gap-4'>
                      <Reviews
                        rate={PRODUCT_DETAILS.reviews.rate}
                        totalReviewers={PRODUCT_DETAILS.reviews.totalReviewers}
                      />
                      <Badge variant='secondary'>
                        <CircleCheck />
                        In Stock
                      </Badge>
                    </div>
                  </div>
                </div>
                <ProductPrice {...PRODUCT_DETAILS.price} className='text-xl' />

                <p className='text-muted-foreground'>{PRODUCT_DETAILS.description}</p>
              </div>

              <Button size='lg' className='w-full'>
                Buy Now
              </Button>

              <ProductForm
                hinges={PRODUCT_DETAILS.hinges}
                selected={{
                  size: PRODUCT_DETAILS.size,
                  color: PRODUCT_DETAILS.color,
                  quantity: 1
                }}
              />

              <ProductInfo
                info={[
                  {
                    label: 'Material',
                    value: '100% Premium Denim'
                  },
                  {
                    label: 'Style',
                    value: 'Puffer Jacket'
                  },
                  {
                    label: 'Season',
                    value: 'All Season'
                  },
                  {
                    label: 'Care',
                    value: 'Machine Washable'
                  },
                  {
                    label: 'Origin',
                    value: 'Made in Italy'
                  },
                  {
                    label: 'Fit',
                    value: 'Regular Fit'
                  }
                ]}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 py-4'>
            <Separator />

            <ProductDescription
              className='md:pr-2'
              description={`<p><strong>Bút</strong><strong> lông dầu PILOT</strong> là một loại <a target="_blank" rel="noopener noreferrer nofollow" class="google-anno" href="https://vanphongphamminaco.com/but-long-dau-pilot/#">&nbsp;<span style="color: inherit"><u>bút</u></span></a> viết dầu có thiết kế 2 đầu, được sử dụng để viết trên nhiều loại bề mặt. Dưới đây là thông tin chi tiết về sản phẩm này:</p><p><strong>Thông số kỹ thuật:</strong></p><ul class="list-disc"><li><p><strong>Kiểu bút:</strong> Bút lông dầu 2 đầu.</p></li><li><p><strong>Số lượng trong một hộp:</strong> 12 cây/hộp.</p></li></ul><p><strong>Đặc điểm và tính năng:</strong></p><ul class="list-disc"><li><p><strong>Bút 2 đầu:</strong> Sản phẩm có hai đầu viết khác nhau hoặc màu sắc khác nhau, giúp bạn chuyển đổi giữa các đặc tính viết một cách dễ dàng.</p></li><li><p><strong>Kiểu dáng thon nhỏ:</strong> Thiết kế của bút thon nhỏ, tiện lợi và dễ sử dụng.</p></li><li><p><strong>Mực đậm:</strong> Bút lông dầu PILOT viết với mực đậm, giúp văn bản nổi bật và dễ đọc.</p></li><li><p><strong>Độ bền màu cao:</strong> Mực viết có độ bền màu cao, không bị nhòe hoặc phai màu sau thời gian sử dụng.</p></li><li><p><strong>Không độc hại:</strong> Sản phẩm không chứa các hạt kim loại nặng độc hại đối với người sử dụng.</p></li></ul><p><strong>Bảo quản:</strong></p><ul class="list-disc"><li><p>Tránh để sản phẩm gần nhiệt độ cao.</p></li><li><p>Tránh va chạm mạnh vào các vật cứng để bảo quản sản phẩm trong tình trạng tốt nhất.</p></li></ul><p><strong>Đối tượng sử dụng phù hợp:</strong></p><ul class="list-disc"><li><p><span style="color: var(--editor-text-blue)"><strong>Các cá nhân và chuyên nghiệp:</strong></span> Bút lông dầu PILOT phù hợp cho cả cá nhân và người làm việc chuyên nghiệp trong việc viết và ghi chép trên nhiều loại giấy và bề mặt.</p></li></ul><p><strong>Ứng dụng trong thực tế:</strong></p><p><span style="color: inherit">Bút viết bảng không xóa được</span></p><p></p><ul class="list-disc"><li><p>Sản phẩm có thể được sử dụng trong văn phòng, trường học, và trong các hoạt động sáng tạo và nghệ thuật.</p></li><li><p>Sản phẩm cũng thích hợp để sử dụng trong việc đánh dấu và tô màu.</p></li></ul><p><strong>Mẹo sử dụng sản phẩm hữu ích:</strong></p><ul class="list-disc"><li><p>Khi không sử dụng, nên đậy kín nắp để tránh mực khô hoặc tiết kiệm mực.</p></li><li><p>Bảo quản sản phẩm ở nhiệt độ phòng và tránh ánh nắng trực tiếp để giữ cho mực không bị chảy hoặc thay đổi màu sắc.</p></li></ul><p>Minaco chuyên cung cấp: văn phòng phẩm, thiết bị máy văn phòng, vật tư tiêu hao, vật tư phòng sạch. Tham khảo ngay danh sách Văn phòng phẩm cơ bản hoặc danh sách Văn phòng phẩm bán chạy. Để được tư vấn trực tiếp vui lòng liên hệ hotline: <a target="_blank" rel="noopener noreferrer nofollow" href="tel:0961531616">0961 53 16 16</a></p>`}
            />

            <Separator />

            <ProductReview className='' {...PRODUCT_DETAILS.reviews} />
          </div>
        </div>
      </section>

      <RelatedProduct />
    </DefaultLayout>
  );
};

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <Carousel
      opts={{
        breakpoints: {
          '(min-width: 768px)': {
            active: false
          }
        }
      }}
    >
      <CarouselContent className='gap-4 md:m-0 md:grid md:grid-cols-3 xl:gap-5'>
        {images.map((img, index) => (
          <CarouselItem className='first:col-span-3 md:p-0' key={`product-detail-1-image-${index}`}>
            <AspectRatio ratio={1} className='overflow-hidden rounded-lg'>
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes={img.sizes}
                className='block size-full object-cover object-center'
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className='md:hidden'>
        <CarouselPrevious className='left-4' />
        <CarouselNext className='right-4' />
      </div>
    </Carousel>
  );
};

const formSchema = z.object({
  color: z.string(),
  quantity: z.number().min(1),
  size: z.string()
});

type FormValues = z.infer<typeof formSchema>;

const ProductForm = ({ hinges, selected }: ProductFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: selected?.color,
      size: selected?.size,
      quantity: selected?.quantity
    }
  });

  function onSubmit(values: FormType) {
    console.log(values);
  }

  const sizeHinges = hinges?.size;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {sizeHinges && (
        <Controller
          control={form.control}
          name={sizeHinges.name}
          render={({ field }) => (
            <fieldset className='space-y-3'>
              <legend className='text-base font-semibold'>{sizeHinges.label}</legend>
              <SizeRadioGroup field={field} options={sizeHinges.options} />
            </fieldset>
          )}
        />
      )}
    </form>
  );
};

const SizeRadioGroup = ({ options, field }: RadioGroupProps) => {
  if (!options) return;

  return (
    <RadioGroup
      {...field}
      value={`${field.value}`}
      onValueChange={(value) => {
        if (value != field.value && value) {
          field.onChange(value);
        }
      }}
      className='flex flex-wrap gap-3'
    >
      {options &&
        options.map((item, index) => (
          <SizeOption
            key={`product-detail-1-size-input-${index}`}
            stockInfo={item.stockInfo}
            id={item.id}
            label={item.label}
            value={item.value}
          />
        ))}
    </RadioGroup>
  );
};

const SizeOption = ({ id, label, stockInfo, value }: SizeOptionProps) => {
  const isOutOfStock = stockInfo.stockStatusCode === 'OUT_OF_STOCK';

  return (
    <label
      htmlFor={id}
      className='hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground relative flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors has-disabled:pointer-events-none has-disabled:opacity-50'
    >
      <RadioGroupItem
        id={id}
        className='absolute size-px overflow-hidden opacity-0'
        value={value}
        disabled={isOutOfStock}
      />
      <span className='uppercase'>{label}</span>
      {isOutOfStock && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-border h-px w-full rotate-45'></div>
        </div>
      )}
    </label>
  );
};

export default ProductDetail;
