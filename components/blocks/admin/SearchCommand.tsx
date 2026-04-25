'use client';

import { LayoutDashboard, BarChart3, ShoppingCart, Users, Rocket } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '@/components/ui/command';

interface Props {
  onSelect?: () => void;
}

export default function SearchCommand({ onSelect }: Props) {
  return (
    <Command className='max-w-full gap-2 bg-transparent'>
      <CommandInput placeholder='Type a command or search...' />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading='Pages'>
          <CommandItem onSelect={onSelect}>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            <span>Dashboard</span>
          </CommandItem>

          <CommandItem onSelect={onSelect}>
            <BarChart3 className='mr-2 h-4 w-4' />
            <span>Analytics</span>
          </CommandItem>

          <CommandItem onSelect={onSelect}>
            <ShoppingCart className='mr-2 h-4 w-4' />
            <span>eCommerce</span>
          </CommandItem>

          <CommandItem onSelect={onSelect}>
            <Users className='mr-2 h-4 w-4' />
            <span>CRM</span>
          </CommandItem>

          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={onSelect}>
            <Rocket className='mr-2 h-4 w-4' />
            <span>SaaS</span>
            <CommandShortcut>12</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
