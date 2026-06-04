import AccountForm from '@/components/blocks/AccountForm';
import React from 'react';

export default function Page() {
  return (
    <section className='px-6 py-4'>
      <div className='space-y-1'>
        <h1 className='text-xl font-medium'>Hồ Sơ Của Tôi</h1>

        <p className='text-muted-foreground'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className='bg-border mt-6 h-px w-full' />
      <AccountForm />
    </section>
  );
}
