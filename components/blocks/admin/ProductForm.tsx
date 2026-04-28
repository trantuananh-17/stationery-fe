'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ProductFormValues, ProductSchema } from '@/types/product.type';
import { Controller, useForm } from 'react-hook-form';
import TiptapEditor from './TiptapEditor';
import ProductMediaPicker from './ProductMediaPicker';
import ProductVariantsForm from './ProductVariantsForm';
import ProductSpecificationsForm from './ProductSpecificationsForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCombobox from './ProductCombobox';

export default function ProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      product: {
        name: '',
        description: '',
        shortDescription: '',
        categoryId: '',
        brandId: '',
        images: [],
        thumbnail: '',
        featured: false,
        status: 'active',
        searchKeywords: [],
        seoTitle: '',
        seoDescription: ''
      },
      specifications: [],
      variants: []
    }
  });

  const attributes = [
    {
      id: 'attr_size',
      name: 'Size',
      values: [
        { id: 'size_s', value: 'Smallllll', slug: 'smallllll' },
        { id: 'size_m', value: 'Medium', slug: 'medium' },
        { id: 'size_l', value: 'Large', slug: 'large' }
      ]
    },
    {
      id: 'attr_size1',
      name: 'Size1',
      values: [
        { id: 'size_s', value: 'Small', slug: 'smallllll' },
        { id: 'size_m', value: 'Medium', slug: 'medium' },
        { id: 'size_l', value: 'Large', slug: 'large' }
      ]
    }
  ];

  const categories = [
    { id: 'cat_1', name: 'Giấy in văn phòng' },
    { id: 'cat_2', name: 'Bút và viết' },
    { id: 'cat_3', name: 'Sổ - Vở học sinh' },
    { id: 'cat_4', name: 'Dụng cụ văn phòng' },
    { id: 'cat_5', name: 'Đồ dùng học sinh' },
    { id: 'cat_6', name: 'Vật tư tiêu hao' },
    { id: 'cat_7', name: 'Vật tư tiêu hao' },
    { id: 'cat_8', name: 'Vật tư tiêu hao' },
    { id: 'cat_9', name: 'Vật tư tiêu hao' },
    { id: 'cat_10', name: 'Vật tư tiêu hao' }
  ];

  const brands = [
    { id: 'brand_1', name: 'Thiên Long' },
    { id: 'brand_2', name: 'Hồng Hà' },
    { id: 'brand_3', name: 'Double A' },
    { id: 'brand_4', name: 'Deli' },
    { id: 'brand_5', name: 'Pentel' },
    { id: 'brand_6', name: 'Casio' }
  ];
  return (
    <form
      onSubmit={form.handleSubmit(
        (values) => console.log('values', values),
        (errors) => console.log('errors', errors)
      )}
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
                  <FieldLabel className='text-muted-foreground text-sm' htmlFor='product-shortDescription'>
                    Mô tả ngắn
                  </FieldLabel>
                  <Input {...field} id='product-shortDescription' aria-invalid={fieldState.invalid} />
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
                        images={imagesField.value}
                        thumbnail={thumbnailField.value}
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
                <ProductVariantsForm value={field.value} onChange={field.onChange} attributes={attributes} />

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
                <ProductSpecificationsForm value={field.value} onChange={field.onChange} attributes={attributes} />

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
                  value: 'active',
                  label: 'Active',
                  description: 'Sản phẩm đang được hiển thị và có thể bán'
                },
                {
                  value: 'inactive',
                  label: 'Inactive',
                  description: 'Sản phẩm bị ẩn và tạm ngừng bán'
                },
                {
                  value: 'draft',
                  label: 'Draft',
                  description: 'Sản phẩm đang là bản nháp'
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
        <Card className='p-4'>
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
        <Button size={'sm'} className='px-5 md:col-span-2' type='submit'>
          Lưu
        </Button>
      </div>
    </form>
  );
}
