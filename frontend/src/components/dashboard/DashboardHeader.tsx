import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddTaskClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddTaskClick }) => {
  const { user } = useAuthContext();
  const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};
  

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
        </h2>
        <p className="text-sm text-muted-foreground">
          Today is {formattedDate}. Here is your workspace metrics summary.
        </p>
      </div>
      {onAddTaskClick && (
        <Button
          onClick={onAddTaskClick}
          className="flex items-center gap-2 px-5 py-5 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
