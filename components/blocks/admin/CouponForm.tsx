'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coupon, CouponFormValues, CouponType } from '@/types/coupon.type';

type CouponFormProps = {
  initialData?: Coupon;
  submitting?: boolean;
  onSubmit: (values: CouponFormValues) => void;
  onCancel: () => void;
};

/** input[type=datetime-local] cần 'YYYY-MM-DDTHH:mm', còn API trả ISO. */
const toLocalInput = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

export default function CouponForm({ initialData, submitting, onSubmit, onCancel }: CouponFormProps) {
  const t = useTranslations('Coupon');

  const [code, setCode] = useState(initialData?.code ?? '');
  const [type, setType] = useState<CouponType>(initialData?.type ?? 'PERCENT');
  const [value, setValue] = useState(String(initialData?.value ?? ''));
  const [minOrderAmount, setMinOrderAmount] = useState(String(initialData?.minOrderAmount ?? 0));
  const [maxDiscount, setMaxDiscount] = useState(String(initialData?.maxDiscount ?? 0));
  const [startsAt, setStartsAt] = useState(toLocalInput(initialData?.startsAt));
  const [expiresAt, setExpiresAt] = useState(toLocalInput(initialData?.expiresAt));
  const [usageLimit, setUsageLimit] = useState(String(initialData?.usageLimit ?? 0));
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  function handleSubmit() {
    onSubmit({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      usageLimit: Number(usageLimit) || 0,
      isActive
    });
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='coupon-code'>{t('code')}</FieldLabel>
          <Input id='coupon-code' value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-type'>{t('type')}</FieldLabel>
          <Select value={type} onValueChange={(v) => setType(v as CouponType)}>
            <SelectTrigger id='coupon-type' className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position='popper'>
              <SelectItem value='PERCENT'>{t('typePercent')}</SelectItem>
              <SelectItem value='FIXED'>{t('typeFixed')}</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-value'>{t('value')}</FieldLabel>
          <Input id='coupon-value' type='number' min={1} value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-min'>{t('minOrderAmount')}</FieldLabel>
          <Input
            id='coupon-min'
            type='number'
            min={0}
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-max'>{t('maxDiscount')}</FieldLabel>
          <Input
            id='coupon-max'
            type='number'
            min={0}
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-limit'>{t('usageLimit')}</FieldLabel>
          <Input
            id='coupon-limit'
            type='number'
            min={0}
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-starts'>{t('startsAt')}</FieldLabel>
          <Input
            id='coupon-starts'
            type='datetime-local'
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor='coupon-expires'>{t('expiresAt')}</FieldLabel>
          <Input
            id='coupon-expires'
            type='datetime-local'
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </Field>
      </div>

      <label className='flex items-center gap-2 text-sm'>
        <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
        {t('active')}
      </label>

      <div className='flex justify-end gap-2'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={submitting}>
          {t('cancel')}
        </Button>

        <Button type='button' onClick={handleSubmit} disabled={submitting}>
          {submitting ? t('saving') : t('save')}
        </Button>
      </div>
    </div>
  );
}
