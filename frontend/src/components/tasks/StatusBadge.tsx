import React from 'react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getColors = () => {
  switch (status) {
    case 'pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20 dark:border-amber-500/30';
    case 'in-progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20 dark:border-blue-500/30';
    case 'completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30';
  }
};

  const formatText = () => {
    if (status === 'in-progress') return 'in progress';
    return status;
  };

  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
        getColors(),
        className
      )}
    >
      {formatText()}
    </span>
  );
};

export default StatusBadge;
