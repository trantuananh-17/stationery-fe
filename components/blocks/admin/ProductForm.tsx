'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ProductFormValues, ProductSchema } from '@/types/product.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

export default function ProductForm() {
  const form = useForm<ProductFormValues>({
    // resolver: zodResolver(ProductSchema),
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
        searchKeywords: [],
        seoTitle: '',
        seoDescription: ''
      },
      specifications: [],
      variants: []
    }
  });

  const onSubmit = (values: ProductFormValues) => {
    console.log(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(
        (values) => console.log('values', values),
        (errors) => console.log('errors', errors)
      )}
      className='grid-col-1 grid w-full gap-4 md:grid-cols-[2fr_1fr]'
    >
      <div className='gap flex flex-col gap-4'>
        <Card className='p-4'>
          <FieldGroup className='flex flex-col gap-4'>
            <Controller
              name='product.name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-muted-foreground text-sm' htmlFor='product-name'>
                    Tên sản phẩm
                  </FieldLabel>
                  <Input {...field} id='product-name' placeholder='Sản phẩm A' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </Card>
        <Card className=''>abc</Card>
        <Card className=''>abc</Card>
      </div>
      <div className='gap flex flex-col gap-4'>
        <Card className=''>abc</Card>
        <Card className=''>abc</Card>
      </div>

      <Button type='submit'>Submit</Button>
    </form>
  );
}
