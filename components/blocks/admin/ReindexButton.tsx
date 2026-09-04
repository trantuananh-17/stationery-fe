'use client';

import { RefreshCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { reindexProducts } from '@/services/discovery.service';
import { useAuthStore } from '@/stores/auth-store';

export default function ReindexButton() {
  const t = useTranslations('Discovery');
  const accessToken = useAuthStore((state) => state.accessToken);

  const [running, setRunning] = useState(false);

  async function handleClick() {
    setRunning(true);

    const response = await reindexProducts(accessToken);

    setRunning(false);

    if (!response.ok) {
      toast.error(t('reindexError'), { position: 'top-right' });
      return;
    }

    toast.success(t('reindexSuccess', { count: response.data?.data?.indexed ?? 0 }), {
      position: 'top-right'
    });
  }

  return (
    <Button variant='outline' onClick={handleClick} disabled={running}>
      <RefreshCcw /> {running ? t('reindexing') : t('reindex')}
    </Button>
  );
}
