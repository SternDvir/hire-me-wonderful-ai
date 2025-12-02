import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'pass' | 'reject' | 'review' | 'pending' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-md border transition-colors',
          // Sizes
          {
            'text-tiny px-1.5 py-0.5': size === 'sm',
            'text-small px-2.5 py-1': size === 'md',
          },
          // Variants - using lighter, more inviting colors
          {
            'bg-neutral-muted text-neutral-light border-neutral-border': variant === 'default' || variant === 'pending',
            'bg-success-muted text-success-light border-success-border': variant === 'pass',
            'bg-danger-muted text-danger-light border-danger-border': variant === 'reject',
            'bg-warning-muted text-warning-light border-warning-border': variant === 'review',
            'bg-accent-muted text-accent-hover border-accent/20': variant === 'info',
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
