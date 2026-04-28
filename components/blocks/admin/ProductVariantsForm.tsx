'use client';

import { useState } from 'react';
import { Ghost, GripVertical, ImagePlus, PlusCircle, X } from 'lucide-react';

import { ProductFormValues } from '@/types/product.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AttributeValue = {
  id: string;
  value: string;
  slug: string;
};

type Attribute = {
  id: string;
  name: string;
  values: AttributeValue[];
};

type OptionGroup = {
  attributeId: string;
  valueIds: string[];
};

type Props = {
  value: ProductFormValues['variants'];
  onChange: (value: ProductFormValues['variants']) => void;
  attributes: Attribute[];
};

export default function ProductVariantsForm({ value, onChange, attributes }: Props) {
  const [enabled, setEnabled] = useState(value?.length > 0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const variants = value ?? [];

  const checkboxClass =
    'border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground';

  const getAttribute = (attributeId: string) => {
    return attributes.find((item) => item.id === attributeId);
  };

  const getValue = (valueId: string) => {
    for (const attribute of attributes) {
      const value = attribute.values.find((item) => item.id === valueId);
      if (value) return value;
    }
  };

  const getVariantKey = (variant: ProductFormValues['variants'][number]) => {
    return variant.attributeValueIds.join('-');
  };

  const generateCombinations = (groups: OptionGroup[]) => {
    const validGroups = groups.filter((group) => group.attributeId && group.valueIds.length > 0);

    if (validGroups.length === 0) return [];

    return validGroups.reduce<string[][]>(
      (acc, group) => acc.flatMap((combo) => group.valueIds.map((valueId) => [...combo, valueId])),
      [[]]
    );
  };

  const syncVariants = (groups: OptionGroup[]) => {
    const combinations = generateCombinations(groups);

    const nextVariants = combinations.map((ids, index) => {
      const oldVariant = variants.find((variant) => variant.attributeValueIds.join('|') === ids.join('|'));

      const values = ids.map((id) => getValue(id)).filter(Boolean) as AttributeValue[];

      return {
        name: values.map((item) => item.value).join(' / '),
        price: oldVariant?.price ?? 0,
        stock: oldVariant?.stock ?? 0,
        compareAtPrice: oldVariant?.compareAtPrice ?? 0,
        image: oldVariant?.image ?? '',
        sortOrder: index,
        isDefault: index === 0,
        attributeValueIds: ids,
        attributeValueSlug: values.map((item) => item.slug)
      };
    });

    onChange(nextVariants);
    setSelectedRows([]);

    if (nextVariants.length === 0 && groups.length === 0) {
      setEnabled(false);
      setEditingIndex(null);
    }
  };

  const handleAddFirst = () => {
    const next = [{ attributeId: '', valueIds: [] }];

    setEnabled(true);
    setOptionGroups(next);
    setEditingIndex(0);
  };

  const handleAddAnotherOption = () => {
    const next = [...optionGroups, { attributeId: '', valueIds: [] }];

    setOptionGroups(next);
    setEditingIndex(next.length - 1);
  };

  const handleChangeAttribute = (index: number, attributeId: string) => {
    const next = [...optionGroups];

    next[index] = {
      attributeId,
      valueIds: []
    };

    setOptionGroups(next);
    syncVariants(next);
  };

  const handleAddValue = (index: number, valueId: string) => {
    const next = [...optionGroups];
    const current = next[index];

    if (!current.valueIds.includes(valueId)) {
      next[index] = {
        ...current,
        valueIds: [...current.valueIds, valueId]
      };
    }

    setOptionGroups(next);
    syncVariants(next);
  };

  const handleRemoveValue = (index: number, valueId: string) => {
    const next = optionGroups
      .map((group, optionIndex) => {
        if (optionIndex !== index) return group;

        return {
          ...group,
          valueIds: group.valueIds.filter((id) => id !== valueId)
        };
      })
      .filter((group) => group.attributeId || group.valueIds.length > 0);

    setOptionGroups(next);
    syncVariants(next);

    if (next.length === 0) {
      setEnabled(false);
      setEditingIndex(null);
    }
  };

  const handleRemoveOption = (index: number) => {
    const next = optionGroups.filter((_, optionIndex) => optionIndex !== index);

    setOptionGroups(next);
    syncVariants(next);

    if (next.length === 0) {
      setEnabled(false);
      setEditingIndex(null);
      onChange([]);
    }
  };

  const handleDeleteSelectedVariants = () => {
    const removedIds = variants
      .filter((variant) => selectedRows.includes(getVariantKey(variant)))
      .flatMap((variant) => variant.attributeValueIds);

    const nextOptionGroups = optionGroups
      .map((group) => ({
        ...group,
        valueIds: group.valueIds.filter((id) => !removedIds.includes(id))
      }))
      .filter((group) => group.valueIds.length > 0);

    setOptionGroups(nextOptionGroups);
    syncVariants(nextOptionGroups);
    setSelectedRows([]);

    if (nextOptionGroups.length === 0) {
      setEnabled(false);
      setEditingIndex(null);
    }
  };

  const updateVariant = (
    index: number,
    key: keyof ProductFormValues['variants'][number],
    nextValue: string | number | boolean
  ) => {
    const next = [...variants];

    next[index] = {
      ...next[index],
      [key]: nextValue
    };

    onChange(next);
  };

  const allSelected = variants.length > 0 && selectedRows.length === variants.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
      return;
    }

    setSelectedRows(variants.map(getVariantKey));
  };

  const toggleSelectRow = (key: string) => {
    setSelectedRows((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }

      return [...current, key];
    });
  };

  return (
    <div className='overflow-hidden'>
      {!enabled && (
        <Button
          variant={'ghost'}
          type='button'
          onClick={handleAddFirst}
          className='text-muted-foreground! text-sx flex items-center gap-2 p-0 hover:underline'
        >
          <PlusCircle className='text-muted-foreground size-4' />
          Thêm biến thể cho sản phẩm
        </Button>
      )}

      {enabled && (
        <div className='overflow-hidden rounded-lg border'>
          {optionGroups.map((group, index) => {
            const attribute = getAttribute(group.attributeId);
            const values = attribute?.values ?? [];
            const remainingValues = values.filter((item) => !group.valueIds.includes(item.id));
            const isEditing = editingIndex === index;

            return (
              <div key={index}>
                {isEditing ? (
                  <div className='grid grid-cols-1 gap-4 border-b p-3 md:p-4'>
                    <div className='space-y-3'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium'>Tên biến thể</label>

                        <Select
                          value={group.attributeId}
                          onValueChange={(nextValue) => handleChangeAttribute(index, nextValue)}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Chọn biến thể' />
                          </SelectTrigger>

                          <SelectContent>
                            {attributes
                              .filter((attribute) => {
                                const selectedByOtherOption = optionGroups.some(
                                  (option, optionIndex) => optionIndex !== index && option.attributeId === attribute.id
                                );

                                return !selectedByOtherOption || attribute.id === group.attributeId;
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
                        <label className='text-sm font-medium'>Giá trị biến thể</label>

                        <div className='space-y-2'>
                          {group.valueIds.map((valueId) => {
                            const selectedValue = getValue(valueId);

                            return (
                              <div key={valueId} className='relative'>
                                <Input value={selectedValue?.value ?? ''} readOnly className='h-10 w-full pr-10' />

                                <Button
                                  type='button'
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleRemoveValue(index, valueId)}
                                  className='absolute top-1/2 right-1 size-8 -translate-y-1/2 active:-translate-y-1/2!'
                                >
                                  <X className='size-4' />
                                </Button>
                              </div>
                            );
                          })}

                          <Select
                            value=''
                            disabled={!group.attributeId || remainingValues.length === 0}
                            onValueChange={(nextValue) => handleAddValue(index, nextValue)}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue
                                placeholder={
                                  !group.attributeId
                                    ? 'Chọn biến thể trước'
                                    : remainingValues.length === 0
                                      ? 'Đã chọn hết giá trị'
                                      : 'Chọn giá trị'
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {remainingValues.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <Button
                          size={'sm'}
                          type='button'
                          variant='outline'
                          className='px-4 text-sm text-red-700'
                          onClick={() => handleRemoveOption(index)}
                        >
                          Xóa
                        </Button>

                        <Button
                          size={'sm'}
                          className='px-4 text-sm'
                          type='button'
                          onClick={() => setEditingIndex(null)}
                        >
                          Xong
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type='button'
                    onClick={() => setEditingIndex(index)}
                    className='hover:bg-muted/40 flex w-full items-center gap-4 border-b p-4 text-left'
                  >
                    <GripVertical className='text-muted-foreground size-5' />

                    <div>
                      <p className='text-sm font-medium'>{attribute?.name || 'Option name'}</p>
                      <p className='text-muted-foreground text-sm'>
                        {group.valueIds
                          .map((id) => getValue(id)?.value)
                          .filter(Boolean)
                          .join(', ') || 'No values'}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            );
          })}

          <button
            type='button'
            onClick={handleAddAnotherOption}
            disabled={optionGroups.length >= attributes.length}
            className='hover:bg-muted/40 flex w-full items-center gap-2 p-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50'
          >
            <PlusCircle className='size-5' />
            Add another option
          </button>
        </div>
      )}

      {variants.length > 0 && (
        <>
          <div className='mt-4 border-t'>
            <Table>
              <TableHeader>
                <TableRow>
                  {selectedRows.length > 0 ? (
                    <TableHead colSpan={5} className='h-12'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} className={checkboxClass} />
                          <span className='text-foreground text-sm font-medium'>{selectedRows.length} selected</span>
                        </div>

                        <Button
                          type='button'
                          variant='outline'
                          className='text-red-600'
                          onClick={handleDeleteSelectedVariants}
                        >
                          Delete variant
                        </Button>
                      </div>
                    </TableHead>
                  ) : (
                    <>
                      <TableHead className='w-12'>
                        <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} className={checkboxClass} />
                      </TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead className='w-45'>Price</TableHead>
                      <TableHead className='w-45'>Compare price</TableHead>
                      <TableHead className='w-35'>Available</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {variants.map((variant, index) => {
                  const key = getVariantKey(variant);
                  const checked = selectedRows.includes(key);

                  return (
                    <TableRow key={key} data-state={checked ? 'selected' : undefined}>
                      <TableCell className='w-12'>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleSelectRow(key)}
                          className={checkboxClass}
                        />
                      </TableCell>

                      <TableCell>
                        <div className='flex items-center gap-4'>
                          <button
                            type='button'
                            className='text-primary flex size-16 items-center justify-center rounded-xl border border-dashed'
                          >
                            <ImagePlus className='size-5' />
                          </button>

                          <span className='font-medium'>{variant.name}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input
                          type='number'
                          min={0}
                          value={variant.price}
                          onChange={(event) => updateVariant(index, 'price', Number(event.target.value))}
                          placeholder='0'
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type='number'
                          min={0}
                          value={variant.compareAtPrice ?? ''}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'compareAtPrice',
                              event.target.value === '' ? 0 : Number(event.target.value)
                            )
                          }
                          placeholder='0'
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type='number'
                          min={0}
                          value={variant.stock}
                          onChange={(event) => updateVariant(index, 'stock', Number(event.target.value))}
                          placeholder='0'
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='border-t px-5 py-4 text-center text-sm'>
            Total inventory across all locations:{' '}
            <span className='font-medium'>
              {variants.reduce((total, item) => total + Number(item.stock || 0), 0)} available
            </span>
          </div>
        </>
      )}
    </div>
  );
}
