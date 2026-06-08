export interface Task {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  completedAt?: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
