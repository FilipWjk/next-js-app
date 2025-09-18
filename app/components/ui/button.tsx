import { ButtonHTMLAttributes, forwardRef } from 'react';
import { mergeClasses } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      default: 'bg-blue-600 text-white shadow hover:bg-blue-700',
      destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
      outline:
        'border border-gray-600 bg-transparent shadow-sm hover:bg-gray-700 hover:text-white text-gray-300',
      ghost: 'hover:bg-gray-700 hover:text-white text-gray-300',
    };

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      icon: 'h-9 w-9',
    };

    return (
      <button
        className={mergeClasses(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
