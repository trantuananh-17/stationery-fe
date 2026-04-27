'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';
import type { CheckoutFormValues } from '@/types/checkout.type';

export default function CheckoutForm() {
  const form = useFormContext<CheckoutFormValues>();

  return (
    <div className='p-2 md:p-4'>
      <section className='space-y-4'>
        <div>
          <h2 className='text-lg font-semibold md:text-xl'>Thông tin nhận hàng</h2>
        </div>

        <FieldGroup className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='shippingAddress.firstName'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-fullName'>Họ và tên</FieldLabel>
                <Input {...field} id='shipping-fullName' placeholder='Nguyễn Văn' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.lastName'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-fullName'>Họ và tên</FieldLabel>
                <Input {...field} id='shipping-fullName' placeholder='A' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.phone'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-phone'>Số điện thoại</FieldLabel>
                <Input {...field} id='shipping-phone' placeholder='0901234567' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-email'>Email</FieldLabel>
                <Input
                  {...field}
                  id='shipping-email'
                  type='email'
                  placeholder='example@email.com'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.address1'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='md:col-span-2' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-address1'>Địa chỉ</FieldLabel>
                <Input
                  {...field}
                  id='shipping-address1'
                  placeholder='Số nhà, tên đường'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.address2'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='md:col-span-2' data-invalid={fieldState.invalid}>
                <div className='flex items-center gap-2'>
                  <FieldLabel htmlFor='shipping-address2'>Địa chỉ bổ sung</FieldLabel>
                  <FieldDescription className='m-0'>(Không bắt buộc)</FieldDescription>
                </div>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id='shipping-address2'
                  placeholder='Căn hộ, tòa nhà, ghi chú thêm'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.city'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-city'>Tỉnh / Thành phố</FieldLabel>
                <Input {...field} id='shipping-city' placeholder='Hồ Chí Minh' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.district'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-district'>Quận / Huyện</FieldLabel>
                <Input {...field} id='shipping-district' placeholder='Quận 1' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='shippingAddress.ward'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className='md:col-span-2' data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='shipping-ward'>Phường / Xã</FieldLabel>
                <Input {...field} id='shipping-ward' placeholder='Phường Bến Nghé' aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </section>

      <section className='mt-4 space-y-4 md:mt-8'>
        <div>
          <h2 className='text-lg font-semibold'>Phương thức thanh toán</h2>
          <p className='text-muted-foreground text-sm'>Chọn cách bạn muốn thanh toán cho đơn hàng.</p>
        </div>

        <Controller
          name='paymentMethod'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className='grid gap-3'>
                <label className='hover:bg-accent/50 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors'>
                  <input
                    type='radio'
                    name={field.name}
                    value='stripe'
                    checked={field.value === 'stripe'}
                    onChange={() => field.onChange('stripe')}
                    className='mt-1'
                  />
                  <div className='space-y-1'>
                    <div className='font-medium'>Thanh toán qua Stripe</div>
                    <p className='text-muted-foreground text-sm'>Thanh toán online bằng thẻ qua Stripe.</p>
                  </div>
                </label>

                <label className='hover:bg-accent/50 flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors'>
                  <input
                    type='radio'
                    name={field.name}
                    value='cod'
                    checked={field.value === 'cod'}
                    onChange={() => field.onChange('cod')}
                    className='mt-1'
                  />
                  <div className='space-y-1'>
                    <div className='font-medium'>Thanh toán khi nhận hàng</div>
                    <p className='text-muted-foreground text-sm'>Thanh toán trực tiếp khi nhận hàng.</p>
                  </div>
                </label>
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='notes'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className='flex items-center gap-2'>
                <FieldLabel htmlFor='checkout-notes'>Ghi chú</FieldLabel>
                <FieldDescription>(Không bắt buộc)</FieldDescription>
              </div>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  value={field.value ?? ''}
                  id='checkout-notes'
                  rows={4}
                  placeholder='Ví dụ: gọi trước khi giao hàng...'
                  className='min-h-24 resize-none'
                  aria-invalid={fieldState.invalid}
                />
              </InputGroup>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </section>
    </div>
  );
}
