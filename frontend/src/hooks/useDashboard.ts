import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import type { ApiResponse, TasksResponseData } from '../types/api';
import type { Task } from '../types/task';

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

const isOverdue = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date();
};

const isDueSoon = (task: Task): boolean => {
  if (!task.dueDate || task.status === 'completed') return false;
  const due = new Date(task.dueDate);
  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 3);
  return due >= now && due <= threeDaysFromNow;
};

export const useDashboard = () => {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // Fetch all non-archived tasks with a high limit
      const response = await api.get<ApiResponse<TasksResponseData>>(
        '/tasks?limit=100&page=1'
      );
      const tasks = response.data.data.tasks;

      // Compute stats client-side
      const stats: DashboardStats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === 'pending').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        completed: tasks.filter((t) => t.status === 'completed').length,
      };

      const dueSoon = tasks.filter(isDueSoon);
      const overdue = tasks.filter(isOverdue);

      return { stats, dueSoon, overdue };
    },
    refetchOnWindowFocus: true,
  });

  return {
    stats: query.data?.stats ?? {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    },
    dueSoonTasks: query.data?.dueSoon ?? [],
    overdueTasks: query.data?.overdue ?? [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
  };
};

export default useDashboard;