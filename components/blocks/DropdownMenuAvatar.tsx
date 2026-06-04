'use client';

import { BadgeCheckIcon, BellIcon, CreditCardIcon, LogOutIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/routing';

type Props = {
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
};

export function DropdownMenuAvatar({ firstName, lastName, email, avatar }: Props) {
  const fullName = `${firstName} ${lastName}`;
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='hover:bg-background' asChild>
        <Button variant='ghost' className='data-[state=open]:bg-background flex items-center gap-2 px-2'>
          <Avatar className='size-8 p-1'>
            <AvatarImage src={avatar} alt={fullName} />
            <AvatarFallback className='bg-background text-sm'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col'>
            <span className='font-medium'>{fullName}</span>
            {email && <span className='text-muted-foreground text-xs'>{email}</span>}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='/account'>
              <BadgeCheckIcon className='mr-2 h-4 w-4' />
              Quản lí hồ sơ
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href='/account/orders'>
              <CreditCardIcon className='mr-2 h-4 w-4' />
              Quản lí đơn hàng
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <Link href='/auth/log-out'>
          <DropdownMenuItem>
            <LogOutIcon className='mr-2 h-4 w-4' />
            Sign Out
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
