import { redirect } from 'next/navigation';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminSidebar } from '@/components/blocks/admin/AdminSidebar';
import Header from '../blocks/admin/Header';
import { Container } from '../ui/container';
import AdminProvider from '@/providers/AdminProvider';
import Provider from '@/components/layouts/Provider';
import { initAuth } from '@/services/auth.service';

interface Props {
  children: React.ReactNode;
}

export default async function AdminLayout(props: Props) {
  const auth = await initAuth();

  const user = auth.user;

  if (auth.shouldLogout) {
    redirect('/auth/log-out');
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <Provider initialAuth={auth}>
      <AdminProvider>
        <TooltipProvider>
          <SidebarProvider defaultOpen>
            <AdminSidebar />

            <SidebarInset className='bg-background'>
              <Header user={user} />

              <Container size='full' className='p-4 md:p-6'>
                <main className='flex-1'>{props.children}</main>
              </Container>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </AdminProvider>
    </Provider>
  );
}
