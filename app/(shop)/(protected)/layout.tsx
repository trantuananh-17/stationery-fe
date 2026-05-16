import React from 'react';
import { redirect } from 'next/navigation';

import Provider from '@/components/layouts/Provider';
import { initAuth } from '@/services/auth.service';

export default async function ProtectedShopLayout({ children }: { children: React.ReactNode }) {
  const auth = await initAuth();

  if (auth.shouldLogout || !auth.user) {
    redirect('/auth/sign-in');
  }

  return <Provider initialAuth={auth}>{children}</Provider>;
}
