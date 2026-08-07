'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import SearchCommand from './SearchCommand';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NotificationMenu } from '@/components/blocks/admin/NotificationMenu';
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminDropdownMenu } from './AdminDropdownMenu';
import { useAuthStore } from '@/stores/auth-store';

export default function Header() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <header className='sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-gray-100 px-6 py-4 backdrop-blur'>
        <div className='flex gap-2'>
          <SidebarTrigger className='' />
          {!isMobile && (
            <Button
              type='button'
              variant='outline'
              className='text-muted-foreground hidden h-9 w-[320px] justify-between rounded-xl sm:flex'
              onClick={() => setOpen(true)}
            >
              <span className='text-muted-foreground/65 flex items-center gap-2'>
                <Search className='h-4 w-4' />
                Search anything
              </span>

              <span className='text-muted-foreground text-xs'>⌘K</span>
            </Button>
          )}
        </div>

        <div className='flex gap-2'>
          <NotificationMenu />
          <AdminDropdownMenu
            firstName={user?.firstName ?? ''}
            lastName={user?.lastName ?? ''}
            email={user?.email ?? ''}
            avatar={undefined}
          />
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='overflow-hidden p-0 sm:max-w-lg [&>button]:hidden'>
          <DialogTitle className='sr-only'>Search</DialogTitle>

          <SearchCommand onSelect={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
