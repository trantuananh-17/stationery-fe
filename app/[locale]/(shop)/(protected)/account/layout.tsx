import { AccountSidebar } from '@/components/blocks/AccountSidebar';
import { Card } from '@/components/ui/card';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex gap-2'>
      <AccountSidebar />

      <main className='flex-1 p-4'>
        <Card className='min-h-[75svh] rounded-xs p-0'>{children}</Card>
      </main>
    </div>
  );
}
