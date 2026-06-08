import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Task } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').trim(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional().or(z.literal('')),
});

type TaskSchemaType = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { createTask, updateTask, isCreating, isUpdating } = useTasks();
  const isEditing = !!taskToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
    },
  });

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');

  useEffect(() => {
    if (taskToEdit) {
      let formattedDate = '';
      if (taskToEdit.dueDate) {
        formattedDate = new Date(taskToEdit.dueDate).toISOString().split('T')[0];
      }
      
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: formattedDate,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [taskToEdit, reset, isOpen]);

  const onSubmit = async (data: TaskSchemaType) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };

      if (isEditing && taskToEdit) {
        await updateTask({ id: taskToEdit._id, payload });
        toast.success('Task updated successfully!');
      } else {
        await createTask(payload);
        toast.success('Task created successfully!');
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Operation failed. Please try again.';
      toast.error(message);
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-xl font-bold">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isEditing 
              ? 'Update the fields below to modify your task settings' 
              : 'Add a new task to your workspace to organize your workload'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Task Title *
            </label>
            <Input
              type="text"
              placeholder="e.g. Design Landing Page"
              className="rounded-xl border-border bg-background/50 focus:bg-background"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Description (Optional)
            </label>
            <textarea
              placeholder="Provide context or instructions for this task..."
              rows={3}
              className="flex w-full rounded-xl border border-input bg-background/50 focus:bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-border resize-none"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => setValue('status', val as TaskSchemaType['status'])}
              >
                <SelectTrigger className="rounded-xl bg-background/50 focus:bg-background border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="pending" className="rounded-lg">Pending</SelectItem>
                  <SelectItem value="in-progress" className="rounded-lg">In Progress</SelectItem>
                  <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Priority
              </label>
              <Select
                value={selectedPriority}
                onValueChange={(val) => setValue('priority', val as TaskSchemaType['priority'])}
              >
                <SelectTrigger className="rounded-xl bg-background/50 focus:bg-background border-border">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="low" className="rounded-lg">Low</SelectItem>
                  <SelectItem value="medium" className="rounded-lg">Medium</SelectItem>
                  <SelectItem value="high" className="rounded-lg">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Due Date
            </label>
            <Input
              type="date"
              className="rounded-xl border-border bg-background/50 focus:bg-background text-foreground"
              {...register('dueDate')}
            />
          </div>

          <DialogFooter className="mt-6 gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
