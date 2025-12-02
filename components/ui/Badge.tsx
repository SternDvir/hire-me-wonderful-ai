import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center font-semibold rounded-full transition-colors',
          // Sizes
          {
            'text-xs px-2.5 py-0.5': size === 'sm',
            'text-sm px-3 py-1': size === 'md',
            'text-base px-4 py-1.5': size === 'lg',
          },
          // Variants
          {
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-green-100 text-green-800': variant === 'success',
            'bg-red-100 text-red-800': variant === 'error',
            'bg-yellow-100 text-yellow-800': variant === 'warning',
            'bg-blue-100 text-blue-800': variant === 'info',
            'bg-purple-100 text-purple-800': variant === 'purple',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
