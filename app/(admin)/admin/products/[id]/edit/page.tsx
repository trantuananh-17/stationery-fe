import { notFound } from 'next/navigation';

import ProductForm from '@/components/blocks/admin/ProductForm';
import { getAdminProductById } from '@/services/product.service';
import { Product, ProductFormValues } from '@/types/product.type';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function mapProductToFormValues(product: Product): ProductFormValues {
  return {
    product: {
      name: product.name ?? '',
      description: product.description ?? '',
      shortDescription: product.shortDescription ?? '',
      categoryId: product.category?.id ?? '',
      brandId: product.brand?.id ?? '',
      images: product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : [],
      thumbnail: product.thumbnail ?? '',
      status: product.status,
      featured: product.featured ?? false,
      searchKeywords: [],
      seoTitle: product.seoTitle ?? '',
      seoDescription: product.seoDescription ?? ''
    },

    specifications:
      product.specifications?.map((spec) => ({
        id: spec.id,
        attributeId: spec.attributeId,
        value: spec.value
      })) ?? [],

    variants:
      product.variants?.map((variant, index) => ({
        id: variant.id,
        name: variant.name ?? '',
        price: Number(variant.price ?? 0),
        compareAtPrice:
          variant.compareAtPrice !== null && variant.compareAtPrice !== undefined
            ? Number(variant.compareAtPrice)
            : null,
        stock: Number(variant.stock ?? 0),
        reservedStock: Number(variant.reservedStock ?? 0),
        image: variant.image ?? null,
        sortOrder: Number(variant.sortOrder ?? index + 1),
        isDefault: variant.isDefault ?? false,
        isAvailable: variant.isAvailable ?? true,
        attributeValueIds: variant.attributes?.map((attr) => attr.attributeValueId).filter(Boolean) ?? [],
        attributeValueSlug: variant.attributes?.map((attr) => attr.attributeValueSlug).filter(Boolean) ?? []
      })) ?? []
  };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const res = await getAdminProductById(id);

  if (!res?.ok || !res?.data?.data) {
    notFound();
  }

  const product = res.data.data;

  const initialData = mapProductToFormValues(product);

  console.log(initialData);

  return (
    <section className='mx-auto max-w-5xl'>
      <h1 className='mb-4 text-xl font-semibold lg:text-2xl'>Chỉnh sửa sản phẩm</h1>

      <ProductForm mode='edit' productId={id} initialData={initialData} />
    </section>
  );
}
