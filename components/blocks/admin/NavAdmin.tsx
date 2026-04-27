'use client';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Collapsible } from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';

type NavSection = {
  label: string;
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    badge?: string | number;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export function NavAdmin({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup className='py-0' key={section.label}>
          <SidebarGroupLabel className='text-[10px] uppercase'>{section.label}</SidebarGroupLabel>

          <SidebarMenu className='gap-0.5'>
            {section.items.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

              return (
                <Collapsible key={item.title} asChild defaultOpen={isActive} className='group/collapsible'>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className='data-[active=true]:text-primary data-[active=true]:bg-muted-foreground/10 hover:bg-muted-foreground/5 hover:font-semibold'
                    >
                      <Link href={item.url} className='text-foreground/75 flex items-center'>
                        {item.icon}
                        <span className='flex-1 text-sm font-medium'>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {item.badge !== undefined && (
                      <SidebarMenuBadge className='bg-primary/10 text-primary right-3 rounded-full px-2 py-0.5 text-xs font-semibold'>
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
