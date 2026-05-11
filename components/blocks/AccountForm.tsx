'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),

  gender: z.enum(['male', 'female', 'other']).optional()
});

type FormType = z.infer<typeof formSchema>;

export default function AccountForm() {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: 'Tuấn',
      lastName: 'Anh',

      gender: 'male'
    }
  });

  async function onSubmit(values: FormType) {
    console.log(values);
  }

  return (
    <div className='mt-6 grid grid-cols-10 gap-6'>
      <div className='col-span-7 max-w-3xl'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-right'>Tên đăng nhập</span>

            <span className='font-medium'>anhkyo24</span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2'>
            <Controller
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <div className='flex items-center gap-4'>
                  <label className='text-muted-foreground text-right'>Họ</label>

                  <div className='space-y-2'>
                    <Input {...field} />

                    {form.formState.errors.lastName && (
                      <p className='text-destructive text-sm'>{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              )}
            />
            <Controller
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <div className='flex items-center gap-4'>
                  <label className='text-muted-foreground text-right'>Tên</label>

                  <div className='space-y-2'>
                    <Input {...field} />

                    {form.formState.errors.firstName && (
                      <p className='text-destructive text-sm'>{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>

          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-right'>Email</span>

            <div className='flex items-center gap-3'>
              <span>s2******@gmail.com</span>

              <Button type='button' variant='link' className='h-auto p-0'>
                Thay Đổi
              </Button>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-right'>Số điện thoại</span>

            <div className='flex items-center gap-3'>
              <span>********30</span>

              <Button type='button' variant='link' className='h-auto p-0'>
                Thay Đổi
              </Button>
            </div>
          </div>

          <Controller
            control={form.control}
            name='gender'
            render={({ field }) => (
              <div className='flex items-center gap-4'>
                <label className='text-muted-foreground shrink-0 whitespace-nowrap'>Giới tính</label>

                <RadioGroup value={field.value} onValueChange={field.onChange} className='flex gap-6'>
                  <label className='flex items-center gap-2'>
                    <RadioGroupItem value='male' id='male' />

                    <span>Nam</span>
                  </label>

                  <label className='flex items-center gap-2'>
                    <RadioGroupItem value='female' id='female' />

                    <span>Nữ</span>
                  </label>

                  <label className='flex items-center gap-2'>
                    <RadioGroupItem value='other' id='other' />

                    <span>Khác</span>
                  </label>
                </RadioGroup>
              </div>
            )}
          />

          <div className='flex items-center gap-4'>
            <span className='text-muted-foreground text-right'>Ngày sinh</span>

            <div className='flex items-center gap-3'>
              <span>**/**/2004</span>

              <Button type='button' variant='link' className='h-auto p-0'>
                Thay Đổi
              </Button>
            </div>
          </div>

          <div className='flex'>
            <Button type='submit' className='col-start-2 w-fit px-8'>
              Lưu
            </Button>
          </div>
        </form>
      </div>

      <div className='col-span-3 border-l p-2'>
        <div className='items-star t flex flex-col'>
          <div className='relative mx-auto mb-5 size-28 overflow-hidden rounded-full border'>
            <Image
              src='https://vanphongphamminaco.com/wp-content/uploads/2023/10/giay-danh-dau-hinh-huou-cao-co-9587.webp'
              alt='avatar'
              fill
              className='object-cover'
            />
          </div>

          <div className='w-full text-center'>
            <Button type='button' variant='outline'>
              Chọn Ảnh
            </Button>

            <div className='text-muted-foreground mt-5 text-sm'>
              <p>Dung lượng file tối đa 1 MB</p>

              <p>Định dạng: .JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
