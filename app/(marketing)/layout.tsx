import type { ReactNode } from 'react';
import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
