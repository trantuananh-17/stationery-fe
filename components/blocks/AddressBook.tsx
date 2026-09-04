'use client';

import { MapPin, Pencil, Star, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import AddressForm from '@/components/blocks/AddressForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { createAddress, deleteAddress, setDefaultAddress, updateAddress } from '@/services/address.service';
import { Address, AddressFormValues } from '@/types/address.type';

type AddressBookProps = {
  accessToken: string | null;
  addresses: Address[];
};

export default function AddressBook({ accessToken, addresses }: AddressBookProps) {
  const t = useTranslations('Address');
  const router = useRouter();

  const [isRefreshing, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const busy = submitting || isRefreshing;

  const refresh = () => startTransition(() => router.refresh());

  async function handleCreate(values: AddressFormValues) {
    setSubmitting(true);

    const response = await createAddress(accessToken, values);

    setSubmitting(false);

    if (!response.ok) {
      toast.error(t('createError'), { position: 'top-right' });
      return;
    }

    toast.success(t('createSuccess'), { position: 'top-right' });
    setCreating(false);
    refresh();
  }

  async function handleUpdate(values: AddressFormValues) {
    if (!editing) return;

    setSubmitting(true);

    const response = await updateAddress(accessToken, editing.id, values);

    setSubmitting(false);

    if (!response.ok) {
      toast.error(t('updateError'), { position: 'top-right' });
      return;
    }

    toast.success(t('updateSuccess'), { position: 'top-right' });
    setEditing(null);
    refresh();
  }

  async function handleSetDefault(addressId: string) {
    const response = await setDefaultAddress(accessToken, addressId);

    if (!response.ok) {
      toast.error(t('setDefaultError'), { position: 'top-right' });
      return;
    }

    toast.success(t('setDefaultSuccess'), { position: 'top-right' });
    refresh();
  }

  async function handleDelete(addressId: string) {
    const response = await deleteAddress(accessToken, addressId);

    if (!response.ok) {
      toast.error(t('deleteError'), { position: 'top-right' });
      return;
    }

    toast.success(t('deleteSuccess'), { position: 'top-right' });
    refresh();
  }

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

            <AddressForm submitting={busy} onSubmit={handleCreate} onCancel={() => setCreating(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <MapPin />
            </EmptyMedia>

            <EmptyTitle>{t('emptyTitle')}</EmptyTitle>
            <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {addresses.map((address) => (
            <Card key={address.id} className='p-0'>
              <CardContent className='space-y-3 p-5'>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <p className='font-semibold'>{address.fullName}</p>
                    <p className='text-muted-foreground text-sm'>{address.phone}</p>
                  </div>

                  {address.isDefault && <Badge variant='secondary'>{t('default')}</Badge>}
                </div>

                <p className='text-sm'>
                  {[address.address1, address.address2, address.ward, address.district, address.city]
                    .filter(Boolean)
                    .join(', ')}
                </p>

                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline' size='sm' onClick={() => setEditing(address)} disabled={busy}>
                    <Pencil /> {t('edit')}
                  </Button>

                  {!address.isDefault && (
                    <Button variant='outline' size='sm' onClick={() => handleSetDefault(address.id)} disabled={busy}>
                      <Star /> {t('setAsDefault')}
                    </Button>
                  )}

                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive'
                    onClick={() => handleDelete(address.id)}
                    disabled={busy}
                  >
                    <Trash2 /> {t('delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('editTitle')}</DialogTitle>
          </DialogHeader>

          {editing && (
            <AddressForm
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
