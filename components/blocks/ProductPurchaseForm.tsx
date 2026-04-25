'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  color: z.string(),
  quantity: z.number().min(1),
  size: z.string()
});

type FormType = z.infer<typeof formSchema>;

type StockStatusCode = 'IN_STOCK' | 'OUT_OF_STOCK';

interface StockInfo {
  stockStatusCode: StockStatusCode;
  stockQuantity?: number;
}

interface ProductOption {
  id: string;
  label: string;
  value: string;
  color?: string;
  stockInfo: StockInfo;
}

interface ProductHinge {
  label: string;
  id: string;
  name: 'size' | 'color' | 'quantity';
  options?: ProductOption[];
  min?: number;
  max?: number;
}
interface ProductPurchaseFormValues {
  color: string;
  quantity: number;
  size: string;
}

interface ProductPurchaseFormProps {
  productId: string;
  selected: ProductPurchaseFormValues;
  hinges?: {
    sizes?: ProductHinge;
    color?: ProductHinge;
    quantity?: ProductHinge;
  };
}

interface SizeRadioGroupProps {
  options?: ProductOption[];
  field: ControllerRenderProps<FormType, 'size'>;
}

interface SizeOptionProps {
  id: string;
  label: string;
  value: string;
  stockInfo: StockInfo;
}

export default function ProductPurchaseForm({ hinges, selected, productId }: ProductPurchaseFormProps) {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: selected.color,
      size: selected.size,
      quantity: selected.quantity
    }
  });

  async function onSubmit(values: ProductPurchaseFormValues) {
    const payload = {
      productId,
      ...values
    };

    console.log('add to cart payload', payload);
  }

  const sizeHinges = hinges?.sizes;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {sizeHinges && (
        <Controller
          control={form.control}
          name='size'
          render={({ field }) => (
            <fieldset className='space-y-3'>
              <legend className='text-base font-semibold'>{sizeHinges.label}</legend>
              <SizeRadioGroup field={field} options={sizeHinges.options} />
            </fieldset>
          )}
        />
      )}

      <div className='flex gap-3'>
        <Button type='submit' size='lg' className='flex-1'>
          Add to cart
        </Button>

        <Button type='button' size='lg' variant='secondary' className='flex-1'>
          Buy now
        </Button>
      </div>
    </form>
  );
}

const SizeRadioGroup = ({ options, field }: SizeRadioGroupProps) => {
  if (!options) return null;

  return (
    <RadioGroup
      value={`${field.value ?? ''}`}
      onValueChange={(value) => {
        if (value && value !== field.value) {
          field.onChange(value);
        }
      }}
      className='flex flex-wrap gap-3'
    >
      {options.map((item, index) => (
        <SizeOption
          key={`product-detail-size-input-${index}`}
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
          <div className='bg-border h-px w-full rotate-45' />
        </div>
      )}
    </label>
  );
};
