'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Check, GripVertical, ImageIcon, Minus, Plus, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FieldLabel } from '@/components/ui/field';
import { uploadImage } from '@/services/upload.service';

type ProductMediaPickerProps = {
  images?: string[];
  thumbnail?: string;
  onImagesChange?: (value: string[]) => void;
  onThumbnailChange?: (value: string) => void;
};

function uniqueUrls(urls: string[]) {
  return Array.from(new Set(urls.filter(Boolean)));
}

export default function ProductMediaPicker({
  images = [],
  thumbnail = '',
  onImagesChange,
  onThumbnailChange
}: ProductMediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedManageUrls, setSelectedManageUrls] = useState<string[]>([]);

  const selectedUrls = uniqueUrls([thumbnail, ...images]);
  const imageItems = images.filter((url) => url && url !== thumbnail);
  const hasMedia = selectedUrls.length > 0;

  const openDialog = () => {
    setOpen(true);
  };

  const toggleManageSelected = (url: string) => {
    setSelectedManageUrls((prev) => (prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]));
  };

  const removeSelected = () => {
    const removing = new Set(selectedManageUrls);

    const nextThumbnail = removing.has(thumbnail) ? (images.find((url) => !removing.has(url)) ?? '') : thumbnail;

    const nextImages = images.filter((url) => !removing.has(url) && url !== nextThumbnail);

    onThumbnailChange?.(nextThumbnail);
    onImagesChange?.(nextImages);
    setSelectedManageUrls([]);
  };

  const handleDropToThumbnail = (imageUrl: string) => {
    if (!imageUrl || imageUrl === thumbnail) return;

    const oldThumbnail = thumbnail;

    onThumbnailChange?.(imageUrl);

    const nextImages = images.filter((url) => url !== imageUrl);

    if (oldThumbnail) {
      nextImages.unshift(oldThumbnail);
    }

    onImagesChange?.(uniqueUrls(nextImages));
    setSelectedManageUrls([]);
  };

  const handleDropToImage = (draggedUrl: string, targetImageUrl: string) => {
    if (!draggedUrl || !targetImageUrl) return;

    if (draggedUrl !== thumbnail) return;

    onThumbnailChange?.(targetImageUrl);

    const nextImages = images.map((url) => (url === targetImageUrl ? draggedUrl : url));

    onImagesChange?.(uniqueUrls(nextImages));
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

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const uploadedUrls = await Promise.all(
      Array.from(files)
        .filter((file) => file.type.startsWith('image/'))
        .map(async (file) => {
          const res = await uploadImage(file);
          return res.data?.data.url;
        })
    );

    const urls = uploadedUrls.filter(Boolean) as string[];

    if (!urls.length) return;

    if (!thumbnail) {
      const [nextThumbnail, ...restImages] = urls;

      onThumbnailChange?.(nextThumbnail ?? '');
      onImagesChange?.(uniqueUrls([...images, ...restImages]));
      setOpen(false);
      return;
    }

    onImagesChange?.(uniqueUrls([...images, ...urls]));
    setOpen(false);
  };

  return (
    <div className='space-y-3'>
      {!hasMedia ? (
        <>
          <FieldLabel className='text-muted-foreground text-sm'>Hình ảnh</FieldLabel>

          <div
            className='flex min-h-36 items-center justify-center rounded-lg border border-dashed'
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleUploadFiles(e.dataTransfer.files);
            }}
          >
            <div className='text-center'>
              <div className='mb-2 flex items-center justify-center gap-3'>
                <Button className='text-sm' size='sm' type='button' variant='outline' onClick={openDialog}>
                  Tải lên mới
                </Button>
              </div>

              <p className='text-muted-foreground text-sm'>Kéo thả hoặc chọn ảnh để upload</p>
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
              draggable={Boolean(thumbnail)}
              onClick={() => thumbnail && toggleManageSelected(thumbnail)}
              onDragStart={(e) => {
                if (thumbnail) e.dataTransfer.setData('media-url', thumbnail);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();

                const mediaUrl = e.dataTransfer.getData('media-url');

                if (mediaUrl) {
                  handleDropToThumbnail(mediaUrl);
                  return;
                }

                handleUploadFiles(e.dataTransfer.files);
              }}
              className={cn(
                'bg-muted relative flex size-42 items-center justify-center overflow-hidden rounded-lg border sm:size-50',
                selectedManageUrls.includes(thumbnail) && 'ring-primary ring-2'
              )}
            >
              {thumbnail ? (
                <>
                  <Image src={thumbnail} alt='thumbnail' fill unoptimized className='object-contain p-0' />

                  {selectedManageUrls.includes(thumbnail) && (
                    <span className='bg-primary text-primary-foreground absolute top-3 left-3 z-10 flex size-5 items-center justify-center rounded'>
                      <Check className='size-4' />
                    </span>
                  )}

                  <GripVertical className='text-muted-foreground absolute top-3 right-3 z-10 size-4' />
                </>
              ) : (
                <ImageIcon className='text-muted-foreground size-8' />
              )}
            </button>

            <div className='flex flex-wrap items-start gap-2'>
              {imageItems.length > 0 && (
                <button
                  type='button'
                  className='bg-background relative size-20 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing sm:hidden sm:size-24'
                >
                  <Image src={imageItems[0]} alt='Product media' fill unoptimized className='object-contain p-0' />

                  {imageItems.length > 1 && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/45 text-2xl font-semibold text-white'>
                      +{imageItems.length}
                    </div>
                  )}
                </button>
              )}

              {imageItems.map((url) => (
                <button
                  key={url}
                  type='button'
                  draggable
                  onClick={() => toggleManageSelected(url)}
                  onDragStart={(e) => e.dataTransfer.setData('media-url', url)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropToImage(e.dataTransfer.getData('media-url'), url);
                  }}
                  className={cn(
                    'bg-background relative hidden size-24 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing sm:flex',
                    selectedManageUrls.includes(url) && 'ring-primary ring-2'
                  )}
                >
                  <Image src={url} alt='item image' fill unoptimized className='object-contain p-0' />

                  {selectedManageUrls.includes(url) && (
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
        <DialogContent className='flex max-w-4xl! flex-col gap-0 overflow-hidden p-0'>
          <DialogHeader className='border-b px-6 py-4'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Tải ảnh lên</DialogTitle>
            </div>
          </DialogHeader>

          <div className='flex flex-1 items-center justify-center p-6'>
            <input
              ref={fileInputRef}
              type='file'
              multiple
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                handleUploadFiles(e.target.files);
                e.target.value = '';
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUploadFiles(e.dataTransfer.files);
              }}
              className='bg-muted/20 hover:bg-muted/40 flex min-h-64 w-full cursor-pointer items-center justify-center rounded-lg border border-dashed'
            >
              <div className='text-center'>
                <UploadCloud className='text-muted-foreground mx-auto mb-2 size-10' />

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

                <p className='text-muted-foreground mt-2 text-xs'>Chỉ hỗ trợ hình ảnh</p>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-2 border-t px-6 py-4'>
            <Button
              size='sm'
              className='cursor-pointer px-4'
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
