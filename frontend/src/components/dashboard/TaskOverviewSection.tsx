import React from 'react';
import type { Task } from '../../types/task';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calendar, AlertCircle, CalendarClock, ArrowUpRight, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../shared/EmptyState';
import PriorityBadge from '../tasks/PriorityBadge';

interface TaskOverviewSectionProps {
  title: string;
  tasks: Task[];
  variant: 'overdue' | 'due-soon';
}

export const TaskOverviewSection: React.FC<TaskOverviewSectionProps> = ({ title, tasks, variant }) => {
  const isOverdue = variant === 'overdue';

  const formatDueDate = (dateStr?: string | null) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="overflow-hidden border border-border bg-card/40 backdrop-blur-sm shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-muted/5 px-6 py-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          {isOverdue ? (
            <AlertCircle className="h-5 w-5 text-rose-500" />
          ) : (
            <CalendarClock className="h-5 w-5 text-primary" />
          )}
          {title}
        </CardTitle>
        <Link to="/tasks" className="text-xs text-primary hover:underline flex items-center gap-0.5 font-semibold">
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-6 flex-grow">
        {tasks.length === 0 ? (
          <EmptyState
            icon={isOverdue ? CheckSquare : Calendar}
            title={isOverdue ? 'No overdue tasks!' : 'No tasks due soon'}
            description={isOverdue ? 'Outstanding! You are fully caught up.' : 'All your upcoming tasks are well planned.'}
            className="border-none py-10 bg-transparent shadow-none backdrop-blur-none"
          />
        ) : (
          <div className="divide-y divide-border/50 -my-3">
            {tasks.map((task) => (
              <div key={task._id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-grow">
                  <p className="font-semibold text-base text-foreground truncate hover:text-primary transition-colors">
                    <Link to="/tasks">{task.title}</Link>
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-md">
                    {task.description || 'No description'}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <span className={`text-xs font-medium flex items-center gap-1.5 ${isOverdue ? 'text-rose-500' : 'text-muted-foreground'}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskOverviewSection;