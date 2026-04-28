'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { Check, GripVertical, ImageIcon, Minus, Plus, Search, UploadCloud, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FieldLabel } from '@/components/ui/field';

type MediaItem = {
  url: string;
};

type ProductMediaPickerProps = {
  images?: string[];
  thumbnail?: string;
  onImagesChange?: (value: string[]) => void;
  onThumbnailChange?: (value: string) => void;
};

const defaultMediaItems: MediaItem[] = [
  {
    url: 'https://vanphongphamminaco.com/wp-content/uploads/2023/06/Giay-in-anh-A4-1-mat-Kim-Mai-DL-135-3.webp'
  },
  {
    url: 'https://vanphongphamminaco.com/wp-content/uploads/2023/06/But-nuoc-Acumen-0.7mm.webp'
  },
  {
    url: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png'
  }
];

export default function ProductMediaPicker({
  images = [],
  thumbnail = '',
  onImagesChange,
  onThumbnailChange
}: ProductMediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultMediaItems);
  const [draftSelectedUrls, setDraftSelectedUrls] = useState<string[]>([]);
  const [selectedManageUrls, setSelectedManageUrls] = useState<string[]>([]);

  const selectedUrls = useMemo(() => {
    return [thumbnail, ...images].filter(Boolean);
  }, [thumbnail, images]);

  const thumbnailItem = mediaItems.find((item) => item.url === thumbnail);

  const imageItems = images
    .filter((url) => url !== thumbnail)
    .map((url) => mediaItems.find((item) => item.url === url))
    .filter(Boolean) as MediaItem[];

  const hasMedia = selectedUrls.length > 0;

  const openDialog = () => {
    setDraftSelectedUrls(selectedUrls);
    setOpen(true);
  };

  const toggleDraftSelected = (url: string) => {
    setDraftSelectedUrls((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  const toggleManageSelected = (url: string) => {
    setSelectedManageUrls((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  const handleDone = () => {
    const uniqueUrls = Array.from(new Set(draftSelectedUrls));

    onThumbnailChange?.(uniqueUrls[0] ?? '');
    onImagesChange?.(uniqueUrls.slice(1));
    setSelectedManageUrls([]);

    setOpen(false);
  };

  const removeSelected = () => {
    const removing = new Set(selectedManageUrls);

    const nextThumbnail = removing.has(thumbnail) ? (images.find((url) => !removing.has(url)) ?? '') : thumbnail;

    const nextImages = images.filter((url) => !removing.has(url) && url !== nextThumbnail);

    onThumbnailChange?.(nextThumbnail);
    onImagesChange?.(nextImages);
    setSelectedManageUrls([]);
  };

  const handleUploadFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const uploadedItems: MediaItem[] = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
      url: URL.createObjectURL(file)
    }));

    setMediaItems((prev) => [...uploadedItems, ...prev]);
    setDraftSelectedUrls((prev) => [...uploadedItems.map((item) => item.url), ...prev]);
  };

  const handleDropToThumbnail = (imageUrl: string) => {
    if (!imageUrl || imageUrl === thumbnail) return;

    const oldThumbnail = thumbnail;

    onThumbnailChange?.(imageUrl);

    const nextImages = images.filter((url) => url !== imageUrl);

    if (oldThumbnail) {
      nextImages.unshift(oldThumbnail);
    }

    onImagesChange?.(Array.from(new Set(nextImages)));
    setSelectedManageUrls([]);
  };

  // const handleDropToImage = (targetImageUrl: string) => {
  //   if (!thumbnail || thumbnail === targetImageUrl) return;

  //   onThumbnailChange?.(targetImageUrl);

  //   const nextImages = images.map((url) => (url === targetImageUrl ? thumbnail : url));

  //   onImagesChange?.(Array.from(new Set(nextImages)));
  //   setSelectedManageUrls([]);
  // };

  const handleDropToImage = (draggedUrl: string, targetImageUrl: string) => {
    if (!draggedUrl || !targetImageUrl) return;

    if (draggedUrl !== thumbnail) return;

    onThumbnailChange?.(targetImageUrl);

    const nextImages = images.map((url) => (url === targetImageUrl ? draggedUrl : url));

    onImagesChange?.(Array.from(new Set(nextImages)));
    setSelectedManageUrls([]);
  };

  const allSelected = selectedUrls.length > 0 && selectedManageUrls.length === selectedUrls.length;

  const someSelected = selectedManageUrls.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedManageUrls([]);
    } else {
      setSelectedManageUrls(selectedUrls);
    }
  };

  return (
    <div className='space-y-3'>
      {!hasMedia ? (
        <>
          <FieldLabel className='text-muted-foreground text-sm'>Hình ảnh</FieldLabel>
          <div className='flex min-h-36 items-center justify-center rounded-lg border border-dashed'>
            <div className='text-center'>
              <div className='mb-2 flex items-center justify-center gap-3'>
                <Button className='text-sm' size={'sm'} type='button' variant='outline' onClick={openDialog}>
                  Tải lên mới
                </Button>

                <button type='button' onClick={openDialog} className='text-sm hover:underline'>
                  Chọn ảnh có sẵn
                </button>
              </div>

              <p className='text-muted-foreground text-sm'>Chấp nhận hình ảnh, video hoặc mô hình 3D</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex items-center justify-between'>
            {selectedManageUrls.length > 0 ? (
              <div className='flex items-center gap-2 text-sm'>
                <Button
                  type='button'
                  onClick={toggleSelectAll}
                  className={cn(
                    'flex size-5 items-center justify-center rounded border',
                    selectedManageUrls.length > 0
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input bg-background'
                  )}
                >
                  {allSelected && <Check className='size-4' />}
                  {someSelected && <Minus className='size-4' />}
                </Button>
                {selectedManageUrls.length} đã chọn
              </div>
            ) : (
              <FieldLabel className='text-muted-foreground text-sm'>Hình ảnh</FieldLabel>
            )}

            {selectedManageUrls.length > 0 && (
              <button type='button' onClick={removeSelected} className='text-sm text-red-600 hover:underline'>
                Xóa
              </button>
            )}
          </div>

          <div className='grid grid-cols-[160px_1fr] gap-3 sm:grid-cols-[200px_1fr]'>
            <button
              type='button'
              onClick={() => thumbnail && toggleManageSelected(thumbnail)}
              onDragStart={(e) => {
                if (thumbnail) e.dataTransfer.setData('media-url', thumbnail);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleDropToThumbnail(e.dataTransfer.getData('media-url'));
              }}
              className={cn(
                'bg-muted relative flex size-42 items-center justify-center overflow-hidden rounded-lg border sm:size-50',
                selectedManageUrls.includes(thumbnail) && 'ring-primary ring-2'
              )}
            >
              {thumbnailItem && (
                <>
                  <Image src={thumbnailItem.url} alt={'thumbnail'} fill className='object-contain p-0' />

                  {selectedManageUrls.includes(thumbnail) && (
                    <span className='bg-primary text-primary-foreground absolute top-3 left-3 z-10 flex size-5 items-center justify-center rounded'>
                      <Check className='size-4' />
                    </span>
                  )}

                  <GripVertical className='text-muted-foreground absolute top-3 right-3 z-10 size-4' />
                </>
              )}
            </button>

            <div className='flex flex-wrap items-start gap-2'>
              {imageItems.length > 0 && (
                <button
                  type='button'
                  className='bg-background relative size-20 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing sm:hidden sm:size-24'
                >
                  <Image src={imageItems[0].url} alt='Product media' fill className='object-contain p-0' />

                  {imageItems.length > 1 && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-semibold text-white'>
                      +{imageItems.length}
                    </div>
                  )}
                </button>
              )}

              {imageItems.map((item) => (
                <button
                  key={item.url}
                  type='button'
                  draggable
                  onClick={() => toggleManageSelected(item.url)}
                  onDragStart={(e) => e.dataTransfer.setData('media-url', item.url)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropToImage(e.dataTransfer.getData('media-url'), item.url);
                  }}
                  className={cn(
                    'bg-background relative hidden size-24 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing sm:flex',
                    selectedManageUrls.includes(item.url) && 'ring-primary ring-2'
                  )}
                >
                  <Image src={item.url} alt={'item image'} fill className='object-contain p-0' />

                  {selectedManageUrls.includes(item.url) && (
                    <span className='bg-primary text-primary-foreground absolute top-2 left-2 z-10 flex size-5 items-center justify-center rounded'>
                      <Check className='size-4' />
                    </span>
                  )}
                </button>
              ))}

              <button
                type='button'
                onClick={openDialog}
                className='bg-background hover:bg-muted flex size-20 items-center justify-center rounded-lg border border-dashed sm:size-24'
              >
                <Plus className='size-5' />
              </button>
            </div>
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='flex h-[80vh] w-[90vw] max-w-4xl! flex-col gap-0 overflow-hidden p-0'>
          <DialogHeader className='border-b px-6 py-4'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Chọn ảnh</DialogTitle>
            </div>
          </DialogHeader>

          <div className='space-y-4 border-b px-6 py-4'>
            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept='image/*'
              className='hidden'
              onChange={(e) => handleUploadFiles(e.target.files)}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUploadFiles(e.dataTransfer.files);
              }}
              className='bg-muted/20 hover:bg-muted/40 flex min-h-32 cursor-pointer items-center justify-center rounded-lg border border-dashed'
            >
              <div className='text-center'>
                <UploadCloud className='text-muted-foreground mx-auto mb-2 size-8' />

                <div className='flex flex-col items-center justify-center gap-2 sm:flex-row'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Tải lên mới
                  </Button>

                  <span className='text-muted-foreground text-xs sm:text-sm'>hoặc kéo thả tệp vào đây</span>
                </div>

                <p className='text-muted-foreground mt-2 text-xs'>Chấp nhận hình ảnh, video hoặc mô hình 3D</p>
              </div>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto p-6'>
            <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
              {mediaItems.map((item) => {
                const selected = draftSelectedUrls.includes(item.url);

                return (
                  <button
                    key={item.url}
                    type='button'
                    onClick={() => toggleDraftSelected(item.url)}
                    className='text-left'
                  >
                    <div
                      className={cn(
                        'bg-background relative aspect-square overflow-hidden rounded-lg border transition',
                        selected && 'border-primary ring-primary ring-2'
                      )}
                    >
                      <Image
                        src={item.url}
                        alt='item image'
                        fill
                        className={cn('size-48 object-contain transition', selected && 'scale-95 opacity-90')}
                      />

                      <span
                        className={cn(
                          'bg-background absolute top-2 left-2 flex size-5 items-center justify-center rounded border',
                          selected && 'border-primary bg-primary text-primary-foreground'
                        )}
                      >
                        {selected && <Check className='size-4' />}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex items-center justify-between border-t px-6 py-4'>
            <Button
              size={'sm'}
              type='button'
              variant='link'
              className='cursor-pointer px-0'
              onClick={() => setDraftSelectedUrls([])}
            >
              Bỏ chọn tất cả
            </Button>

            <div className='flex gap-2'>
              <Button
                size={'sm'}
                className='cursor-pointer px-4'
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>

              <Button size={'sm'} className='cursor-pointer px-4' type='button' onClick={handleDone}>
                Xong
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
