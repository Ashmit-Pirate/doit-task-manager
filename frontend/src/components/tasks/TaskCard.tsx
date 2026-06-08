import React, { useState } from 'react';
import type { Task } from '../../types/task';
import { Card, CardContent, CardFooter } from '../ui/card';
import { useTasks } from '../../hooks/useTasks';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Edit2, 
  Trash2, 
  Archive, 
  Square,
  CheckCircle,
  ArchiveRestore,
  CircleDot
} from 'lucide-react';
import { Button } from '../ui/button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskStatus, deleteTask, archiveTask, isDeleting } = useTasks();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleToggle = async () => {
    try {
      const updated = await toggleTaskStatus(task._id);
      toast.success(`Task status updated to "${updated.status}"`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task status.';
      toast.error(message);
    }
  };

  const handleArchive = async () => {
    try {
      const updated = await archiveTask(task._id);
      toast.success(updated.isArchived ? 'Task archived successfully' : 'Task unarchived successfully');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to archive task.';
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      toast.success('Task deleted successfully');
      setDeleteOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete task.';
      toast.error(message);
    }
  };

  const formatDueDate = (dateStr?: string | null) => {
    if (!dateStr) return 'No due date';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isCompleted = task.status === 'completed';
  const isOverdue =
    !isCompleted &&
    !!task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`overflow-hidden border border-border bg-card/45 backdrop-blur-sm shadow-sm flex flex-col h-full transition-all duration-300 hover:shadow-md ${isCompleted ? 'bg-muted/10 border-border/40 opacity-80' : ''}`}>
        <CardContent className="p-6 flex-grow">
          {/* Badges Header */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          {/* Title and Quick Complete Checkbox */}
          <div className="flex items-start gap-3 mb-2">
            <button
              onClick={handleToggle}
              className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="Toggle Complete"
            >
              {task.status === 'completed' && (
                <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
              )}
              {task.status === 'in-progress' && (
                <CircleDot className="h-5 w-5 text-amber-500 fill-amber-500/10 hover:text-amber-600" />
              )}
              {task.status === 'pending' && (
                <Square className="h-5 w-5 text-rose-500 hover:text-rose-600" />
              )}
            </button>
            <h3 className={`font-bold text-xl text-foreground leading-snug break-words ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
          </div>

          {/* Description */}
          <p className={`text-base text-muted-foreground leading-relaxed break-words pl-8 ${isCompleted ? 'text-muted-foreground/60' : ''}`}>
            {task.description || 'No description provided.'}
          </p>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="px-6 py-3 border-t border-border/40 flex justify-between items-center bg-muted/10">
          {/* Due Date */}
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${
            isOverdue 
              ? 'text-destructive' 
              : 'text-muted-foreground'
          }`}>
            <Calendar className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-muted-foreground/75'}`} />
            {isOverdue ? `⚠ ${formatDueDate(task.dueDate)}` : formatDueDate(task.dueDate)}
          </span>

          {/* Action Button Icons */}
          <div className="flex items-center gap-1">
            {/* Edit */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="Edit Task"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>

            {/* Archive / Unarchive */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchive}
              className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label={task.isArchived ? 'Restore Task' : 'Archive Task'}
            >
              {task.isArchived ? (
                <ArchiveRestore className="h-3.5 w-3.5" />
              ) : (
                <Archive className="h-3.5 w-3.5" />
              )}
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteOpen(true)}
              className="h-8 w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg"
              aria-label="Delete Task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        taskTitle={task.title}
      />
    </motion.div>
  );
};

export default TaskCard;
