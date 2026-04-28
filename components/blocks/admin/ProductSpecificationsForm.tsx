'use client';

import { GripVertical, PlusCircle, X } from 'lucide-react';

import { ProductFormValues } from '@/types/product.type';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Attribute = {
  id: string;
  name: string;
};

type Props = {
  value: ProductFormValues['specifications'];
  onChange: (value: ProductFormValues['specifications']) => void;
  attributes: Attribute[];
};

export default function ProductSpecificationsForm({ value, onChange, attributes }: Props) {
  const specifications = value ?? [];

  const handleAddFirst = () => {
    onChange([
      {
        attributeId: '',
        value: ''
      }
    ]);
  };

  const handleAddAnother = () => {
    onChange([
      ...specifications,
      {
        attributeId: '',
        value: ''
      }
    ]);
  };

  const handleChangeAttribute = (index: number, attributeId: string) => {
    const next = [...specifications];

    next[index] = {
      ...next[index],
      attributeId
    };

    onChange(next);
  };

  const handleChangeValue = (index: number, nextValue: string) => {
    const next = [...specifications];

    next[index] = {
      ...next[index],
      value: nextValue
    };

    onChange(next);
  };

  const handleRemove = (index: number) => {
    onChange(specifications.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className='overflow-hidden'>
      <div className='p-0'>
        {specifications.length === 0 && (
          <Button
            variant={'ghost'}
            type='button'
            onClick={handleAddFirst}
            className='text-muted-foreground! flex items-center gap-2 p-0 text-sm font-medium hover:underline'
          >
            <PlusCircle className='size-4' />
            Thêm thông số cho sản phẩm
          </Button>
        )}

        {specifications.length > 0 && (
          <div className='overflow-hidden rounded-lg border'>
            {specifications.map((specification, index) => (
              <div key={index} className='grid grid-cols-[1fr_40px] gap-4 border-b p-3 last:border-b-0 md:p-4'>
                <div className='grid gap-2 md:grid-cols-2 md:gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Tên thuộc tính</label>

                    <Select
                      value={specification.attributeId}
                      onValueChange={(nextValue) => handleChangeAttribute(index, nextValue)}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Chọn thuộc tính' className='w-full' />
                      </SelectTrigger>

                      <SelectContent>
                        {attributes
                          .filter((attribute) => {
                            const selectedByOtherRow = specifications.some(
                              (item, itemIndex) => itemIndex !== index && item.attributeId === attribute.id
                            );

                            return !selectedByOtherRow || attribute.id === specification.attributeId;
                          })
                          .map((attribute) => (
                            <SelectItem key={attribute.id} value={attribute.id}>
                              {attribute.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <label className='text-sm'>Giá trị thuộc tính</label>

                    <Input
                      value={specification.value}
                      onChange={(event) => handleChangeValue(index, event.target.value)}
                      placeholder='Nhập giá trị thuộc tính'
                      className='w-full'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-center'>
                  <Button type='button' variant='ghost' size='icon' onClick={() => handleRemove(index)}>
                    <X className='size-4' />
                  </Button>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={handleAddAnother}
              disabled={specifications.length >= attributes.length}
              className='hover:bg-muted/40 flex w-full items-center gap-2 p-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'
            >
              <PlusCircle className='size-5' />
              Add another attribute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
