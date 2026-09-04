'use client';

import { TicketPercent, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateCoupon } from '@/services/coupon.service';
import { useAuthStore } from '@/stores/auth-store';
import { ValidatedCoupon } from '@/types/coupon.type';

type CouponInputProps = {
  subtotal: number;
  applied: ValidatedCoupon | null;
  onApply: (coupon: ValidatedCoupon | null) => void;
};

export default function CouponInput({ subtotal, applied, onApply }: CouponInputProps) {
  const t = useTranslations('Coupon');
  const accessToken = useAuthStore((state) => state.accessToken);

  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;

    setChecking(true);

    const response = await validateCoupon(accessToken, code.trim(), subtotal);

    setChecking(false);

    if (!response.ok || !response.data?.data) {
      // BFF trả message của domain error (hết hạn, chưa đủ điều kiện, hết lượt...).
      toast.error(response.data?.message || t('invalid'), { position: 'top-right' });
      return;
    }

    onApply(response.data.data);
    toast.success(t('applied'), { position: 'top-right' });
  }

  if (applied) {
    return (
      <div className='flex items-center justify-between rounded-md border border-dashed px-3 py-2'>
        <span className='flex items-center gap-2 text-sm font-medium'>
          <TicketPercent className='size-4' />
          {applied.code}
        </span>

        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => {
            onApply(null);
            setCode('');
          }}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className='flex gap-2'>
      <Input
        value={code}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), handleApply())}
        placeholder={t('placeholder')}
      />

      <Button type='button' variant='outline' onClick={handleApply} disabled={checking}>
        {checking ? t('checking') : t('apply')}
      </Button>
    </div>
  );
}
