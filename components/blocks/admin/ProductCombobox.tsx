'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type ComboboxOption = {
  id: string;
  name: string;
};

type Props = {
  value?: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
};

export default function EntityCombobox({
  value,
  onChange,
  options,
  placeholder = 'Chọn dữ liệu',
  emptyText = 'Không tìm thấy dữ liệu',
  disabled
}: Props) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const selectedOption = options.find((item) => item.id === value);

  const filteredOptions = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return options;

    return options.filter((option) => option.name.toLowerCase().includes(search));
  }, [keyword, options]);

  const handleSelect = (option: ComboboxOption) => {
    onChange(option.id);
    setKeyword('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          disabled={disabled}
          className='w-full justify-between font-normal'
        >
          <span className='truncate'>{selectedOption?.name ?? placeholder}</span>

          <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent align='start' className='w-(--radix-popover-trigger-width) p-0'>
        <Command shouldFilter={false}>
          <CommandInput placeholder='Tìm kiếm...' value={keyword} onValueChange={setKeyword} />

          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem key={option.id} value={option.name} onSelect={() => handleSelect(option)}>
                  <Check className={cn('mr-2 size-4', value === option.id ? 'opacity-100' : 'opacity-0')} />

                  <span>{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
