import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
  button?: {
    label: string;
    href: string;
  };
}

export default function TitlePage({ title, subtitle, button }: Props) {
  return (
    <section className='flex items-start justify-between gap-4'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
        <p className='text-muted-foreground mt-1 text-sm'>{subtitle}</p>
      </div>

      {button && (
        <Button asChild>
          <Link href={button.href}>
            <Plus />
            {button.label}
          </Link>
        </Button>
      )}
    </section>
  );
}
