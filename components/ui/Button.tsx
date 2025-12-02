import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variant: {
        primary: [
          'bg-accent hover:bg-accent-hover text-white',
          'shadow-soft hover:shadow-glow',
          'focus-visible:ring-accent',
        ].join(' '),
        secondary: [
          'bg-background-tertiary/50 hover:bg-background-tertiary',
          'border border-border hover:border-border-focus',
          'text-text-primary',
          'focus-visible:ring-border-focus',
        ].join(' '),
        ghost: [
          'bg-transparent hover:bg-background-tertiary/50',
          'text-text-secondary hover:text-text-primary',
          'focus-visible:ring-border-focus',
        ].join(' '),
        danger: [
          'bg-danger/90 hover:bg-danger text-white',
          'shadow-soft hover:shadow-glow-danger',
          'focus-visible:ring-danger',
        ].join(' '),
        success: [
          'bg-success/90 hover:bg-success text-white',
          'shadow-soft hover:shadow-glow-success',
          'focus-visible:ring-success',
        ].join(' '),
      },
      size: {
        sm: 'h-8 px-3 text-small gap-1.5',
        md: 'h-9 px-4 text-body gap-2',
        lg: 'h-11 px-6 text-body gap-2',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
