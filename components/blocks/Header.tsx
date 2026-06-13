'use client';

import { InputButtonGroup } from '@/components/blocks/InputButtonGroup';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/routing';
import { useAuthStore } from '@/stores/auth-store';
import { IconType, LinkType } from '@/types/type';
import { VariantProps } from 'class-variance-authority';
import { Menu, User } from 'lucide-react';

import { CartDrawer } from './CartDrawer';
import { DropdownMenuAvatar } from './DropdownMenuAvatar';

export type HeaderUser = {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

interface Props {
  logo?: IconType;
  navItems?: {
    label: string;
    link: LinkType;
  }[];
  primaryButton?: {
    label: string;
    link: LinkType;
    variant?: VariantProps<typeof buttonVariants>['variant'];
    icon?: IconType;
  };
  secondaryButton?: {
    label: string;
    link: LinkType;
    variant?: VariantProps<typeof buttonVariants>['variant'];
    icon?: IconType;
  };
  initialAccessToken?: string;
  initialUser?: HeaderUser | null;
}

export default function HeaderClient({
  logo,
  navItems,
  primaryButton,
  secondaryButton,
  initialAccessToken,
  initialUser
}: Props) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const currentAccessToken = accessToken || initialAccessToken;
  const currentUser = user || initialUser;

  const isLoggedIn = !!currentAccessToken && !!currentUser;

  const renderGuestAccountMenu = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button id='btn_account' variant='ghost' size='icon' aria-label='Tài khoản'>
            <User className='size-5' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-40'>
          {secondaryButton?.link?.href && (
            <DropdownMenuItem asChild>
              <Link id='btn_login' href={secondaryButton.link.href} target={secondaryButton.link.target || '_self'}>
                {secondaryButton.label}
              </Link>
            </DropdownMenuItem>
          )}

          {primaryButton?.link?.href && (
            <DropdownMenuItem asChild>
              <Link id='btn_register' href={primaryButton.link.href} target={primaryButton.link.target || '_self'}>
                {primaryButton.label}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderAuthAction = () => {
    if (isLoggedIn && currentUser) {
      return (
        <DropdownMenuAvatar
          firstName={currentUser.firstName}
          lastName={currentUser.lastName}
          email={currentUser.email}
        />
      );
    }

    return renderGuestAccountMenu();
  };

  return (
    <header className='bg-background sticky top-0 z-50 py-2'>
      <div className='flex items-center justify-between gap-2'>
        <SidebarTrigger className='md:hidden' />

        <div>{logo}</div>

        <nav className='hidden items-center md:flex md:gap-4 lg:gap-8'>
          {navItems?.map((item, index) => (
            <Link
              key={index}
              href={item.link.href}
              target={item.link.target || '_self'}
              className='text-muted-foreground hover:text-foreground truncate text-xs font-medium transition-colors md:text-sm'
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <InputButtonGroup className='hidden max-w-50 lg:flex' />

        <div className='flex items-center gap-2'>
          <CartDrawer />

          {renderAuthAction()}

          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='ghost' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side='right'
              className='data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right w-70 duration-250 ease-out sm:w-[320px]'
            >
              <SheetTitle className='sr-only'>Menu mobile</SheetTitle>
              <SheetDescription className='sr-only'>Menu mobile.</SheetDescription>

              <div className='mt-6 flex flex-col gap-6 px-4'>
                <Link href='/' className='flex items-center' aria-label='Home'>
                  {logo}
                </Link>

                <nav className='flex flex-col gap-4'>
                  {navItems?.map((item, index) => (
                    <Link
                      key={index}
                      href={item.link.href}
                      target={item.link.target || '_self'}
                      className='text-muted-foreground hover:text-foreground text-lg font-medium transition-colors'
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {!isLoggedIn && !isAuthPage && (
                  <div className='flex flex-col gap-3 border-t pt-4'>
                    {secondaryButton?.link?.href && (
                      <Link href={secondaryButton.link.href} target={secondaryButton.link.target || '_self'}>
                        <Button variant={secondaryButton.variant || 'outline'} size='lg' className='w-full gap-2'>
                          {secondaryButton.label}
                          {secondaryButton.icon}
                        </Button>
                      </Link>
                    )}

                    {primaryButton?.link?.href && (
                      <Link href={primaryButton.link.href} target={primaryButton.link.target || '_self'}>
                        <Button variant={primaryButton.variant || 'default'} size='lg' className='w-full gap-2'>
                          {primaryButton.label}
                          {primaryButton.icon}
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
