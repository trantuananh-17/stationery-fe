'use client';

import { Check, Package, Pencil, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adjustStock } from '@/services/inventory.service';
import { InventoryItem } from '@/types/inventory.type';

type InventoryTableProps = {
  accessToken: string | null;
  items: InventoryItem[];
  lowStockThreshold: number;
};

export default function InventoryTable({ accessToken, items, lowStockThreshold }: InventoryTableProps) {
  const t = useTranslations('AdminInventories');
  const router = useRouter();

  const [isRefreshing, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState('');
  const [saving, setSaving] = useState(false);

  function startEdit(item: InventoryItem) {
    setEditingId(item.variantId);
    setDraftStock(String(item.stock));
  }

  async function handleSave(item: InventoryItem) {
    const nextStock = Number(draftStock);

    if (!Number.isInteger(nextStock) || nextStock < 0) {
      toast.error(t('invalidStock'), { position: 'top-right' });
      return;
    }

    // Chặn ngay ở client cho khớp quy tắc phía service: không hạ tồn dưới phần đang giữ.
    if (nextStock < item.reservedStock) {
      toast.error(t('belowReserved', { reserved: item.reservedStock }), { position: 'top-right' });
      return;
    }

    setSaving(true);

    const response = await adjustStock(accessToken, item.variantId, nextStock);

    setSaving(false);

    if (!response.ok) {
      toast.error(t('adjustError'), { position: 'top-right' });
      return;
    }

    toast.success(t('adjustSuccess'), { position: 'top-right' });
    setEditingId(null);
    startTransition(() => router.refresh());
  }

  if (!items.length) {
    return <p className='text-muted-foreground py-10 text-center'>{t('empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('product')}</TableHead>
          <TableHead>{t('sku')}</TableHead>
          <TableHead className='text-right'>{t('stock')}</TableHead>
          <TableHead className='text-right'>{t('reserved')}</TableHead>
          <TableHead className='text-right'>{t('available')}</TableHead>
          <TableHead className='text-right'>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => {
          const available = item.stock - item.reservedStock;
          const isEditing = editingId === item.variantId;

          return (
            <TableRow key={item.variantId}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.productName}
                      width={40}
                      height={40}
                      className='size-10 rounded object-cover'
                    />
                  ) : (
                    <span className='bg-muted flex size-10 items-center justify-center rounded'>
                      <Package className='size-4' />
                    </span>
                  )}

                  <div>
                    <p className='font-medium'>{item.productName}</p>
                    <p className='text-muted-foreground text-xs'>{item.variantName}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className='font-mono text-xs'>{item.sku}</TableCell>

              <TableCell className='text-right'>
                {isEditing ? (
                  <Input
                    type='number'
                    min={0}
                    value={draftStock}
                    onChange={(event) => setDraftStock(event.target.value)}
                    className='ml-auto w-24 text-right'
                  />
                ) : (
                  item.stock
                )}
              </TableCell>

              <TableCell className='text-right'>{item.reservedStock}</TableCell>

              <TableCell className='text-right'>
                {available <= lowStockThreshold ? (
                  <Badge variant='destructive'>{available}</Badge>
                ) : (
                  available
                )}
              </TableCell>

              <TableCell className='text-right'>
                {isEditing ? (
                  <div className='flex justify-end gap-1'>
                    <Button size='sm' onClick={() => handleSave(item)} disabled={saving || isRefreshing}>
                      <Check />
                    </Button>

                    <Button size='sm' variant='outline' onClick={() => setEditingId(null)} disabled={saving}>
                      <X />
                    </Button>
                  </div>
                ) : (
                  <Button size='sm' variant='outline' onClick={() => startEdit(item)} disabled={isRefreshing}>
                    <Pencil /> {t('edit')}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
