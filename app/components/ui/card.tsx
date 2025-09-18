import { HTMLAttributes } from 'react';
import { mergeClasses } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={mergeClasses(
        'rounded-xl border border-gray-700 bg-gray-800 text-white shadow-lg',
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={mergeClasses('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={mergeClasses('font-semibold text-2xl leading-none tracking-tight text-white', className)}
      {...props}
    />
  );
}
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={mergeClasses('p-6 pt-0', className)} {...props} />;
}
