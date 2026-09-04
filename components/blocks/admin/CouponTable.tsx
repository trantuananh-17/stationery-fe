'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import CouponForm from '@/components/blocks/admin/CouponForm';
import { StatusBadge } from '@/components/blocks/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createCoupon, deleteCoupon, updateCoupon } from '@/services/coupon.service';
import { Coupon, CouponFormValues } from '@/types/coupon.type';

type CouponTableProps = {
  accessToken: string | null;
  coupons: Coupon[];
};

export default function CouponTable({ accessToken, coupons }: CouponTableProps) {
  const t = useTranslations('Coupon');
  const router = useRouter();

  const [isRefreshing, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);

  const busy = submitting || isRefreshing;

  const refresh = () => startTransition(() => router.refresh());

  async function handleCreate(values: CouponFormValues) {
    setSubmitting(true);
    const response = await createCoupon(accessToken, values);
    setSubmitting(false);

    if (!response.ok) {
      toast.error(response.data?.message || t('createError'), { position: 'top-right' });
      return;
    }

    toast.success(t('createSuccess'), { position: 'top-right' });
    setCreating(false);
    refresh();
  }

  async function handleUpdate(values: CouponFormValues) {
    if (!editing) return;

    setSubmitting(true);
    const response = await updateCoupon(accessToken, editing.id, values);
    setSubmitting(false);

    if (!response.ok) {
      toast.error(response.data?.message || t('updateError'), { position: 'top-right' });
      return;
    }

    toast.success(t('updateSuccess'), { position: 'top-right' });
    setEditing(null);
    refresh();
  }

  async function handleDelete(couponId: string) {
    const response = await deleteCoupon(accessToken, couponId);

    if (!response.ok) {
      toast.error(t('deleteError'), { position: 'top-right' });
      return;
    }

    toast.success(t('deleteSuccess'), { position: 'top-right' });
    refresh();
  }

  const formatValue = (coupon: Coupon) =>
    coupon.type === 'PERCENT'
      ? `${coupon.value}%`
      : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.value);

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogTrigger asChild>
            <Button>{t('addNew')}</Button>
          </DialogTrigger>

          <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
              <DialogTitle>{t('addNew')}</DialogTitle>
            </DialogHeader>

            <CouponForm submitting={busy} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <p className='text-muted-foreground py-10 text-center'>{t('empty')}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('code')}</TableHead>
              <TableHead>{t('value')}</TableHead>
              <TableHead className='text-right'>{t('minOrderAmount')}</TableHead>
              <TableHead className='text-right'>{t('usage')}</TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead className='text-right'>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className='font-mono font-medium'>{coupon.code}</TableCell>
                <TableCell>{formatValue(coupon)}</TableCell>
                <TableCell className='text-right'>{coupon.minOrderAmount || 0}</TableCell>
                <TableCell className='text-right'>
                  {coupon.usedCount}
                  {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ''}
                </TableCell>
                <TableCell>
                  <StatusBadge status={coupon.isActive ? 'ACTIVE_TRUE' : 'ACTIVE_FALSE'} />
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-1'>
                    <Button variant='outline' size='sm' onClick={() => setEditing(coupon)} disabled={busy}>
                      <Pencil />
                    </Button>

                    <Button
                      variant='outline'
                      size='sm'
                      className='text-destructive'
                      onClick={() => handleDelete(coupon.id)}
                      disabled={busy}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('editTitle')}</DialogTitle>
          </DialogHeader>

          {editing && (
            <CouponForm
              initialData={editing}
              submitting={busy}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
