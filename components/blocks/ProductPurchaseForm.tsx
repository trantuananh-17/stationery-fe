'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { ProductPrice } from '@/components/blocks/ProductPrice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ProductVariant, ProductVariantOption } from '@/types/product.type';
import { useCart } from '@/hooks/use-cart';
import SpinnerButton from './SpinnerButton';

const formSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().min(1),
  selectedOptions: z.record(z.string(), z.string())
});

type FormType = z.infer<typeof formSchema>;

interface ProductPurchaseFormProps {
  productId: string;
  variants?: ProductVariant[];
  variantOptions?: ProductVariantOption[];
  selected?: {
    variantId?: string;
    quantity?: number;
  };
}

interface VariantOptionButtonProps {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export default function ProductPurchaseForm({
  variants = [],
  variantOptions = [],
  selected,
  productId
}: ProductPurchaseFormProps) {
  const { addItem, isItemPending } = useCart();

  const defaultVariant = useMemo(() => {
    return variants.find((item) => item.isDefault) ?? variants[0];
  }, [variants]);

  const firstAvailableVariant = useMemo(() => {
    return variants.find((item) => item.isAvailable && item.stock > 0);
  }, [variants]);

  const initialVariant = useMemo(() => {
    const selectedVariant = variants.find((item) => item.id === selected?.variantId);

    if (selectedVariant) {
      const selectedVariantIsOutOfStock = !selectedVariant.isAvailable || selectedVariant.stock <= 0;

      // Nếu selected là default mà hết stock => chuyển sang variant còn hàng kế tiếp
      if (selectedVariant.isDefault && selectedVariantIsOutOfStock) {
        return firstAvailableVariant ?? selectedVariant;
      }

      // Nếu selected không phải default mà hết stock => giữ nguyên
      return selectedVariant;
    }

    if (!defaultVariant) return undefined;

    const defaultVariantIsOutOfStock = !defaultVariant.isAvailable || defaultVariant.stock <= 0;

    // Nếu default hết stock => chọn variant còn hàng kế tiếp
    if (defaultVariantIsOutOfStock) {
      return firstAvailableVariant ?? defaultVariant;
    }

    return defaultVariant;
  }, [variants, selected?.variantId, defaultVariant, firstAvailableVariant]);

  const defaultSelectedOptions = useMemo(() => {
    return (
      initialVariant?.attributes.reduce<Record<string, string>>((acc, attr) => {
        acc[attr.attributeId] = attr.attributeValueId;
        return acc;
      }, {}) ?? {}
    );
  }, [initialVariant]);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variantId: '',
      quantity: 1,
      selectedOptions: {}
    }
  });

  const selectedOptions = useWatch({
    control: form.control,
    name: 'selectedOptions'
  });

  const quantity = useWatch({
    control: form.control,
    name: 'quantity'
  });

  const matchedVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.attributes.every((attr) => {
        return selectedOptions?.[attr.attributeId] === attr.attributeValueId;
      })
    );
  }, [variants, selectedOptions]);

  const maxQuantity = matchedVariant?.stock ?? 0;

  const isOutOfStock = !matchedVariant || !matchedVariant.isAvailable || matchedVariant.stock <= 0;

  const isSubmitDisabled = !matchedVariant || isOutOfStock;

  useEffect(() => {
    form.reset({
      variantId: initialVariant?.id ?? '',
      quantity: selected?.quantity ?? 1,
      selectedOptions: defaultSelectedOptions
    });
  }, [form, initialVariant?.id, selected?.quantity, defaultSelectedOptions]);

  useEffect(() => {
    form.setValue('variantId', matchedVariant?.id ?? '', {
      shouldValidate: true
    });
  }, [form, matchedVariant?.id]);

  useEffect(() => {
    if (!matchedVariant) return;

    if (matchedVariant.stock <= 0) {
      form.setValue('quantity', 1, {
        shouldValidate: true
      });
      return;
    }

    if (quantity > matchedVariant.stock) {
      form.setValue('quantity', matchedVariant.stock, {
        shouldValidate: true
      });
    }

    if (quantity < 1) {
      form.setValue('quantity', 1, {
        shouldValidate: true
      });
    }
  }, [form, matchedVariant, quantity]);

  async function onSubmit(values: FormType) {
    if (!matchedVariant || isOutOfStock) return;

    await addItem(values.variantId, values.quantity);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      {matchedVariant && (
        <ProductPrice
          showBadge
          hasInfo
          price={matchedVariant.price}
          compareAtPrice={matchedVariant.compareAtPrice}
          className='text-xl'
        />
      )}

      {variantOptions.map((option) => (
        <Controller
          key={option.attributeId}
          control={form.control}
          name={`selectedOptions.${option.attributeId}`}
          render={({ field }) => (
            <fieldset className='space-y-3'>
              <legend className='text-base font-semibold'>{option.attributeName}</legend>

              <RadioGroup
                value={field.value ?? ''}
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                className='flex flex-wrap gap-3'
              >
                {option.values.map((value) => {
                  const disabled = isOptionDisabled({
                    variants,
                    selectedOptions,
                    attributeId: option.attributeId,
                    attributeValueId: value.id
                  });

                  return (
                    <VariantOptionButton
                      key={value.id}
                      id={`${option.attributeId}-${value.id}`}
                      label={value.value}
                      value={value.id}
                      disabled={disabled}
                    />
                  );
                })}
              </RadioGroup>
            </fieldset>
          )}
        />
      ))}

      {matchedVariant && (
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <span>
            Đã chọn: <span className='font-medium'>{matchedVariant.name}</span>
          </span>

          <span className='bg-border h-4 w-0.5' />

          {isOutOfStock ? (
            <span className='text-destructive'>Hết hàng</span>
          ) : (
            <span>Còn {matchedVariant.stock - matchedVariant.reservedStock} sản phẩm</span>
          )}
        </div>
      )}

      <div className='flex flex-col gap-3 sm:flex-row sm:items-end'>
        <Controller
          control={form.control}
          name='quantity'
          render={({ field }) => (
            <div className='space-y-2'>
              <legend className='text-base font-semibold'>Số lượng</legend>

              <div className='flex h-10 w-fit items-center overflow-hidden rounded-md border'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  disabled={isOutOfStock || field.value <= 1}
                  onClick={() => {
                    field.onChange(Math.max(1, field.value - 1));
                  }}
                  className='h-11 rounded-none'
                >
                  <Minus className='size-4' />
                </Button>

                <Input
                  type='number'
                  min={1}
                  max={maxQuantity || 1}
                  value={field.value}
                  disabled={isOutOfStock}
                  onChange={(event) => {
                    const rawValue = Number(event.target.value);

                    if (Number.isNaN(rawValue)) {
                      field.onChange(1);
                      return;
                    }

                    if (maxQuantity > 0 && rawValue > maxQuantity) {
                      field.onChange(maxQuantity);
                      return;
                    }

                    field.onChange(Math.max(1, rawValue));
                  }}
                  onBlur={() => {
                    if (maxQuantity > 0 && field.value > maxQuantity) {
                      field.onChange(maxQuantity);
                      return;
                    }

                    if (field.value < 1) {
                      field.onChange(1);
                    }
                  }}
                  className='h-11 w-16 [appearance:textfield] rounded-none border-x border-y-0 text-center shadow-none focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />

                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  disabled={isOutOfStock || field.value >= maxQuantity}
                  onClick={() => {
                    field.onChange(Math.min(maxQuantity, field.value + 1));
                  }}
                  className='h-11 rounded-none'
                >
                  <Plus className='size-4' />
                </Button>
              </div>
            </div>
          )}
        />

        <div className='flex flex-1 gap-3'>
          <Button
            type='submit'
            size={'lg'}
            className='flex-1'
            disabled={isSubmitDisabled || isItemPending(matchedVariant?.id ?? '')}
          >
            {isItemPending(matchedVariant?.id ?? '') ? <SpinnerButton /> : 'Thêm giỏ hàng'}
          </Button>

          <Button type='button' size='lg' variant='secondary' className='flex-1' disabled={isSubmitDisabled}>
            Mua ngay
          </Button>
        </div>
      </div>
    </form>
  );
}

function isOptionDisabled({
  variants,
  selectedOptions,
  attributeId,
  attributeValueId
}: {
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  attributeId: string;
  attributeValueId: string;
}) {
  const nextSelectedOptions = {
    ...selectedOptions,
    [attributeId]: attributeValueId
  };

  return !variants.some((variant) => {
    const isMatched = variant.attributes.every((attr) => {
      const selectedValue = nextSelectedOptions[attr.attributeId];

      if (!selectedValue) return true;

      return selectedValue === attr.attributeValueId;
    });

    return isMatched && variant.isAvailable && variant.stock > 0;
  });
}

const VariantOptionButton = ({ id, label, value, disabled }: VariantOptionButtonProps) => {
  return (
    <label
      htmlFor={id}
      className='hover:bg-accent hover:text-accent-foreground has-checked:bg-primary has-checked:text-primary-foreground relative flex h-10 min-w-16 cursor-pointer items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors has-disabled:pointer-events-none has-disabled:opacity-50'
    >
      <RadioGroupItem
        id={id}
        className='absolute size-px overflow-hidden opacity-0'
        value={value}
        disabled={disabled}
      />

      <span>{label}</span>

      {disabled && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-border h-px w-full rotate-45' />
        </div>
      )}
    </label>
  );
};
