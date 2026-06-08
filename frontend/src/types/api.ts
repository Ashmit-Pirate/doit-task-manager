import type { Task } from './task';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponseData {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface TasksResponseData {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  totalTasks: number;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}