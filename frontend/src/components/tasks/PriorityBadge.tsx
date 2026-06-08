import React from 'react';
import { cn } from '../../lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const getColors = () => {
    switch (priority) {
      case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/30';
    }
  };

  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
        getColors(),
        className
      )}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
