'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Address, AddressFormValues, AddressSchema } from '@/types/address.type';

type AddressFormProps = {
  initialData?: Address;
  submitting?: boolean;
  onSubmit: (values: AddressFormValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: AddressFormValues = {
  fullName: '',
  phone: '',
  address1: '',
  address2: '',
  ward: '',
  district: '',
  city: '',
  isDefault: false
};

export default function AddressForm({ initialData, submitting, onSubmit, onCancel }: AddressFormProps) {
  const t = useTranslations('Address');

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initialData
      ? {
          fullName: initialData.fullName,
          phone: initialData.phone,
          address1: initialData.address1,
          address2: initialData.address2 ?? '',
          ward: initialData.ward,
          district: initialData.district,
          city: initialData.city,
          isDefault: initialData.isDefault
        }
      : EMPTY_VALUES
  });

  const textFields = [
    { name: 'fullName', label: t('fullName') },
    { name: 'phone', label: t('phone') },
    { name: 'address1', label: t('address1') },
    { name: 'address2', label: t('address2') },
    { name: 'ward', label: t('ward') },
    { name: 'district', label: t('district') },
    { name: 'city', label: t('city') }
  ] as const;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {textFields.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className={name.startsWith('address') ? 'sm:col-span-2' : ''}>
                <FieldLabel className='text-muted-foreground text-sm' htmlFor={`address-${name}`}>
                  {label}
                </FieldLabel>

                <Input {...field} value={field.value ?? ''} id={`address-${name}`} aria-invalid={fieldState.invalid} />

                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
      </div>

      <Controller
        name='isDefault'
        control={form.control}
        render={({ field }) => (
          <label className='flex items-center gap-2 text-sm'>
            <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
            {t('setAsDefault')}
          </label>
        )}
      />

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={submitting}>
          {t('cancel')}
        </Button>

        <Button type='submit' disabled={submitting}>
          {submitting ? t('saving') : t('save')}
        </Button>
      </div>
    </form>
  );
}
