'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAddresses } from '@/services/address.service';
import { useAuthStore } from '@/stores/auth-store';
import { Address } from '@/types/address.type';
import type { CheckoutFormValues } from '@/types/checkout.type';

const NEW_ADDRESS = 'new';

/**
 * Sổ địa chỉ lưu `fullName`, còn form checkout tách Họ / Tên.
 * Quy ước: từ cuối cùng là Tên, phần còn lại là Họ.
 */
function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts[parts.length - 1]
  };
}

export default function CheckoutAddressPicker() {
  const t = useTranslations('Address');
  const form = useFormContext<CheckoutFormValues>();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string>(NEW_ADDRESS);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    async function loadAddresses() {
      const response = await getAddresses(accessToken);

      if (cancelled) return;

      const data = response.data?.data ?? [];

      setAddresses(data);

      const defaultAddress = data.find((address) => address.isDefault) ?? data[0];

      if (defaultAddress) {
        setSelected(defaultAddress.id);
        applyAddress(defaultAddress);
      }
    }

    loadAddresses();

    return () => {
      cancelled = true;
    };
    // applyAddress chỉ dùng form.setValue nên không cần vào deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  function applyAddress(address: Address) {
    const { firstName, lastName } = splitFullName(address.fullName);

    form.setValue('shippingAddress.firstName', firstName, { shouldValidate: true });
    form.setValue('shippingAddress.lastName', lastName, { shouldValidate: true });
    form.setValue('shippingAddress.phone', address.phone, { shouldValidate: true });
    form.setValue('shippingAddress.address1', address.address1, { shouldValidate: true });
    form.setValue('shippingAddress.address2', address.address2 ?? '');
    form.setValue('shippingAddress.ward', address.ward, { shouldValidate: true });
    form.setValue('shippingAddress.district', address.district, { shouldValidate: true });
    form.setValue('shippingAddress.city', address.city, { shouldValidate: true });
  }

  function handleChange(value: string) {
    setSelected(value);

    if (value === NEW_ADDRESS) {
      form.resetField('shippingAddress.firstName');
      form.resetField('shippingAddress.lastName');
      form.resetField('shippingAddress.phone');
      form.resetField('shippingAddress.address1');
      form.resetField('shippingAddress.address2');
      form.resetField('shippingAddress.ward');
      form.resetField('shippingAddress.district');
      form.resetField('shippingAddress.city');
      return;
    }

    const address = addresses.find((item) => item.id === value);

    if (address) {
      applyAddress(address);
    }
  }

  if (!addresses.length) return null;

  return (
    <Field className='mb-4'>
      <FieldLabel htmlFor='saved-address'>{t('savedAddresses')}</FieldLabel>

      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger id='saved-address' className='w-full'>
          <SelectValue />
        </SelectTrigger>

        <SelectContent position='popper'>
          {addresses.map((address) => (
            <SelectItem key={address.id} value={address.id}>
              {address.fullName} — {[address.address1, address.ward, address.district, address.city].join(', ')}
              {address.isDefault ? ` (${t('default')})` : ''}
            </SelectItem>
          ))}

          <SelectItem value={NEW_ADDRESS}>{t('useNewAddress')}</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  );
}
