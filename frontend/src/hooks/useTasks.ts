import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { ApiResponse, TasksResponseData } from '../types/api';
import type { Task } from '../types/task';

interface FetchTasksParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
  archived?: boolean;
}

interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in-progress' | 'completed';
  dueDate?: string | null;
}

type UpdateTaskPayload = Pick<
  Task,
  'title' | 'description' | 'priority' | 'status' | 'dueDate'
>;

export const useTasks = (params: FetchTasksParams = {}) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const {
        page = 1,
        limit = 6,
        status = '',
        priority = '',
        search = '',
        sort = '',
        archived = false,
      } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      if (status && status !== 'all') queryParams.append('status', status);
      if (priority && priority !== 'all') queryParams.append('priority', priority);
      if (search) queryParams.append('search', search);
      if (sort) queryParams.append('sort', sort);
      if (archived) queryParams.append('archived', 'true');

      const response = await api.get<ApiResponse<TasksResponseData>>(
        `/tasks?${queryParams.toString()}`
      );
      return response.data.data;
    },
    refetchOnWindowFocus: true,
  });

  const invalidateCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const createTaskMutation = useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const response = await api.post<ApiResponse<Task>>('/tasks', payload);
      return response.data.data;
    },
    onSuccess: () => {
      invalidateCaches();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateTaskPayload>;
    }) => {
      const response = await api.put<ApiResponse<Task>>(
        `/tasks/${id}`,
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      invalidateCaches();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<object>>(`/tasks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      invalidateCaches();
    },
  });

  const toggleTaskStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<Task>>(
        `/tasks/${id}/toggle`
      );
      return response.data.data;
    },
    onSuccess: () => {
      invalidateCaches();
    },
  });

  const archiveTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<ApiResponse<Task>>(
        `/tasks/${id}/archive`
      );
      return response.data.data;
    },
    onSuccess: () => {
      invalidateCaches();
    },
  });

  return {
    tasksData: tasksQuery.data,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error?.message || null,
    refetch: tasksQuery.refetch,

    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    createError: createTaskMutation.error?.message || null,

    updateTask: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    updateError: updateTaskMutation.error?.message || null,

    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
    deleteError: deleteTaskMutation.error?.message || null,

    toggleTaskStatus: toggleTaskStatusMutation.mutateAsync,
    isToggling: toggleTaskStatusMutation.isPending,

    archiveTask: archiveTaskMutation.mutateAsync,
    isArchiving: archiveTaskMutation.isPending,
  };
};

export default useTasks;