/**
 * Container Component
 *
 * Responsive max-width container for consistent section layouts.
 */

import type { ReactNode } from 'react';

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: ReactNode;
}

const sizeClasses = {
  sm: 'max-w-2xl', // 672px
  md: 'max-w-4xl', // 896px
  lg: 'max-w-6xl', // 1152px
  xl: 'max-w-7xl', // 1280px
  full: 'w-full',
};

export function Container({ size = 'lg', className = '', children }: ContainerProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
