import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, ShoppingCart } from 'lucide-react';

export function NotificationMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-2'>
          <Bell className='h-5 w-5' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80 p-0'>
        <div className='border-b px-4 py-2'>
          <h3 className='font-semibold'>Thông báo</h3>
        </div>

        <ScrollArea className='h-75'>
          <div className='space-y-1 px-4 py-3'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='hover:bg-muted flex items-start gap-3 rounded-lg px-2 py-3'>
                <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 p-2'>
                  <ShoppingCart size={5} className='h-6 w-6 stroke-2' />
                </div>

                <div className='min-w-0 flex-1'>
                  <p className='font-medium'>New order received</p>
                  <p className='text-muted-foreground line-clamp-1 text-sm'>Emma Wilson placed order ORD-7891</p>
                  <p className='text-muted-foreground text-xs'>2 min ago</p>
                </div>

                <div className='mt-2 size-2 rounded-full bg-black' />
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='border-t px-4 py-3 text-center text-sm font-medium'>View all notifications</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
