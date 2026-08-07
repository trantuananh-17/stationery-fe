export default function Loading() {
  return (
    <div className='bg-background mx-auto flex min-h-[90svh] w-full max-w-sm flex-col items-center justify-center gap-6'>
      <div className='flex flex-col items-center gap-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary' />
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    </div>
  );
}
