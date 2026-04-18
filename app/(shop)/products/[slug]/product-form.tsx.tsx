// app/products/[slug]/product-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  color: z.string(),
  quantity: z.number().min(1),
  size: z.string()
});

type FormType = z.infer<typeof formSchema>;

export default function ProductForm({ variants }: { variants }) {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: variants[0]?.color ?? '',
      size: variants[0]?.size ?? '',
      quantity: variants[0]?.quantity ?? 1
    }
  });

  const onSubmit = (data: FormType) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
      <input {...form.register('color')} />
      <input {...form.register('size')} />
      <input type='number' {...form.register('quantity', { valueAsNumber: true })} />
      <button type='submit'>Submit</button>
    </form>
  );
}
