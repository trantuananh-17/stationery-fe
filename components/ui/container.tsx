import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'default';
}

const sizeClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[96rem]',
  full: 'max-w-full',
  default: 'max-w-[var(--container-max-width)]'
};

const Container: React.FC<ContainerProps> = ({ children, className, size = 'default' }) => {
  return <div className={cn('mx-auto w-full px-4 py-4', sizeClasses[size], className)}>{children}</div>;
};

export { Container };
