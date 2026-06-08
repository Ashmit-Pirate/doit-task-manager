import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary",
        className
      )}
      {...props}
    />
  );
};

export default LoadingSpinner;
