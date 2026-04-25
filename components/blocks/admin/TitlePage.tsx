import React from 'react';

interface Props {
  title: string;
  subtitle: string;
}

export default function TitlePage({ title, subtitle }: Props) {
  return (
    <section>
      <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
      <p className='text-muted-foreground mt-1 text-sm'>{subtitle}</p>
    </section>
  );
}
