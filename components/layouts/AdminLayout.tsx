import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminSidebar } from '@/components/blocks/admin/AdminSidebar';
import Header from '../blocks/admin/Header';
import { Container } from '../ui/container';
import AdminProvider from '@/providers/AdminProvider';
import Provider from '@/components/layouts/Provider';
import AuthInitializer from '@/components/layouts/AuthInitializer';

interface Props {
  children: React.ReactNode;
}

// Static shell — auth guard handled by middleware (proxy.ts).
// Auth state initialized client-side via AuthInitializer → /api/auth/session.
export default function AdminLayout(props: Props) {
  return (
    <Provider>
      <AuthInitializer redirectOnFail />
      <AdminProvider>
        <TooltipProvider>
          <SidebarProvider defaultOpen>
            <AdminSidebar />

            <SidebarInset className='bg-background'>
              <Header />

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
