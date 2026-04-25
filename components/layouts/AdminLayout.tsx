import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AdminSidebar } from '@/components/blocks/admin/AdminSidebar';
import Header from '../blocks/admin/Header';
import { Container } from '../ui/container';

interface Props {
  children: React.ReactNode;
}
export default function AdminLayout(props: Props) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AdminSidebar />

        <SidebarInset>
          <Header />
          <Container size='full' className='p-6'>
            <main className='flex-1'>{props.children}</main>
          </Container>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
