import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type BreadcrumbLinkItem = {
  label: string;
  href: string;
};

interface Props {
  title?: string;
  breadcrumbs?: {
    parent?: BreadcrumbLinkItem;
    child?: BreadcrumbLinkItem;
  };
  paginationPage?: string;
}

export default function BreadcrumbSection({ title, breadcrumbs, paginationPage }: Props) {
  const t = useTranslations('Breadcrumb');

  return (
    <Breadcrumb>
      <BreadcrumbList className='gap-1 text-sm'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>{t('home')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs?.child ? (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon-sm' variant='ghost'>
                    <BreadcrumbEllipsis />
                    <span className='sr-only'>{t('openMenu')}</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='start' className='min-w-60'>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href='/products'>{t('products')}</Link>
                    </DropdownMenuItem>

                    {breadcrumbs.parent && (
                      <DropdownMenuItem asChild>
                        <Link href={breadcrumbs.parent.href}>{breadcrumbs.parent.label}</Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={breadcrumbs.child.href}>{breadcrumbs.child.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {title && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}

            {paginationPage && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('page', { number: paginationPage })}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </>
        ) : (
          <>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href='/products'>{t('products')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbs?.parent && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumbs.parent.href}>{breadcrumbs.parent.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}

            {title && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}

            {paginationPage && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{t('page', { number: paginationPage })}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
