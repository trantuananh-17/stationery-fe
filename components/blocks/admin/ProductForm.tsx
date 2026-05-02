'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/components/ui/select';
// import { createAdminProduct, updateAdminProduct } from '@/services/product.service';
import { ProductFormValues, ProductSchema } from '@/types/product.type';

import ProductCombobox from './ProductCombobox';
import ProductMediaPicker from './ProductMediaPicker';
import ProductSpecificationsForm from './ProductSpecificationsForm';
import ProductVariantsForm from './ProductVariantsForm';
import TiptapEditor from './TiptapEditor';
import { categories } from '@/constants/category';
import { brands } from '@/constants/brand';
import { createAdminProduct, updateAdminProduct } from '@/services/product.service';
import { attributeVariants } from '@/constants/attribute_variant';
import { specification } from '@/constants/specification';

type Props = {
  mode?: 'create' | 'edit';
  productId?: string;
  initialData?: ProductFormValues;
};

const DEFAULT_VALUES: ProductFormValues = {
  product: {
    name: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    brandId: '',
    images: [],
    thumbnail: '',
    status: 'DRAFT',
    featured: false,
    searchKeywords: [],
    seoTitle: '',
    seoDescription: ''
  },
  specifications: [],
  variants: []
};

function mergeDefaultValues(initialData?: ProductFormValues): ProductFormValues {
  if (!initialData) {
    return DEFAULT_VALUES;
  }

  return {
    product: {
      ...DEFAULT_VALUES.product,
      ...initialData.product,
      images: initialData.product.images ?? [],
      thumbnail: initialData.product.thumbnail ?? '',
      status: initialData.product.status ?? 'DRAFT',
      featured: initialData.product.featured ?? false,
      searchKeywords: initialData.product.searchKeywords ?? [],
      seoTitle: initialData.product.seoTitle ?? '',
      seoDescription: initialData.product.seoDescription ?? ''
    },
    specifications: initialData.specifications ?? [],
    variants: initialData.variants ?? []
  };
}

export default function ProductForm({ mode = 'create', productId, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(() => mergeDefaultValues(initialData), [initialData]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const res =
        mode === 'edit' && productId ? await updateAdminProduct(productId, values) : await createAdminProduct(values);

      if (!res?.ok) {
        console.log('submit error', res);
        return;
      }

      router.push('/admin/products');
      router.refresh();
    });
    console.log(values);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => console.log('errors', errors))}
      className='grid w-full grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]'
    >
      <div className='flex flex-col gap-4'>
        <Card className='p-3 md:p-4'>
          <FieldGroup className='flex flex-col gap-4'>
            <Controller
              name='product.name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-muted-foreground text-sm' htmlFor='product-name'>
                    Tên sản phẩm
                  </FieldLabel>

                  <Input {...field} id='product-name' aria-invalid={fieldState.invalid} />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='product.shortDescription'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-muted-foreground text-sm' htmlFor='product-short-description'>
                    Mô tả ngắn
                  </FieldLabel>

                  <Input {...field} id='product-short-description' aria-invalid={fieldState.invalid} />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='product.description'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-muted-foreground text-sm'>Mô tả chi tiết</FieldLabel>

                  <TiptapEditor value={field.value} onChange={field.onChange} />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='product.images'
              control={form.control}
              render={({ field: imagesField, fieldState }) => (
                <Controller
                  name='product.thumbnail'
                  control={form.control}
                  render={({ field: thumbnailField }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <ProductMediaPicker
                        images={imagesField.value ?? []}
                        thumbnail={thumbnailField.value ?? ''}
                        onImagesChange={imagesField.onChange}
                        onThumbnailChange={thumbnailField.onChange}
                      />

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            />
          </FieldGroup>
        </Card>

        <Card className='p-3 md:p-4'>
          <Controller
            name='variants'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-muted-foreground text-sm'>Biến thể</FieldLabel>

                <ProductVariantsForm
                  value={field.value ?? []}
                  onChange={field.onChange}
                  attributes={attributeVariants}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </Card>

        <Card className='p-3 md:p-4'>
          <Controller
            name='specifications'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-muted-foreground text-sm'>Thông số</FieldLabel>

                <ProductSpecificationsForm
                  value={field.value ?? []}
                  onChange={field.onChange}
                  attributes={specification}
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </Card>
      </div>

      <div className='flex flex-col gap-4'>
        <Card className='p-3 md:p-4'>
          <Controller
            name='product.status'
            control={form.control}
            render={({ field, fieldState }) => {
              const statuses = [
                {
                  value: 'ACTIVE',
                  label: 'Active',
                  description: 'Sản phẩm đang được hiển thị và có thể bán'
                },
                {
                  value: 'DRAFT',
                  label: 'Draft',
                  description: 'Sản phẩm đang là bản nháp'
                },
                {
                  value: 'ARCHIVED',
                  label: 'Archived',
                  description: 'Sản phẩm đã được lưu trữ'
                }
              ] as const;

              const selectedStatus = statuses.find((item) => item.value === field.value);

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-muted-foreground text-sm'>Trạng thái</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                      <span className='font-medium'>{selectedStatus?.label ?? 'Chọn trạng thái'}</span>
                    </SelectTrigger>

                    <SelectContent position='popper' side='bottom' align='start'>
                      <SelectGroup>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className='flex flex-col items-start text-left'>
                              <span className='font-medium'>{status.label}</span>
                              <span className='text-muted-foreground text-xs'>{status.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />
        </Card>

        <Card className='flex flex-col gap-4 p-4'>
          <Controller
            name='product.categoryId'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-muted-foreground text-sm'>Danh mục</FieldLabel>

                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={categories}
                  placeholder='Chọn danh mục'
                  emptyText='Không tìm thấy danh mục'
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='product.brandId'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-muted-foreground text-sm'>Thương hiệu</FieldLabel>

                <ProductCombobox
                  value={field.value}
                  onChange={field.onChange}
                  options={brands}
                  placeholder='Chọn thương hiệu'
                  emptyText='Không tìm thấy thương hiệu'
                />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </Card>
      </div>

      <div className='col-span-1 flex items-center justify-end md:col-span-2'>
        <Button size='sm' className='px-5 md:col-span-2' type='submit' disabled={isPending}>
          {isPending ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật' : 'Lưu'}
        </Button>
      </div>
    </form>
  );
}
