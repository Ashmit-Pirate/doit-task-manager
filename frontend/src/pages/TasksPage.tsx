import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import TaskCardSkeleton from '../components/shared/TaskCardSkeleton';
import EmptyState from '../components/shared/EmptyState';
import ErrorMessage from '../components/shared/ErrorMessage';
import { motion } from 'framer-motion';
import { Plus, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useSearchParams } from 'react-router-dom';

import type { Task } from '../types/task';

export const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  const initialArchived = searchParams.get('archived') === 'true';

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState('all');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(initialArchived);
  const [sort, setSort] = useState('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { tasksData, isLoading, error } = useTasks({
    page,
    limit: 6,
    status,
    priority,
    search,
    sort,
    archived: showArchived,
  });

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (tasksData?.totalPages || 1)) {
      setPage(newPage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      {/* Top Title & Add Task Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tasks Workspace
          </h2>
          <p className="text-sm text-muted-foreground">
            View, filter, edit, and organize all your workspace items
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-5 rounded-xl font-semibold text-sm shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Active / Archived Tabs */}
      <div className="flex p-1 bg-muted/30 border border-border/50 rounded-xl max-w-xs">
        <button
          onClick={() => {
            setShowArchived(false);
            setPage(1);
          }}
          className={`flex-grow py-2 text-xs font-bold rounded-lg transition-all duration-200 ${!showArchived
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Active Tasks
        </button>
        <button
          onClick={() => {
            setShowArchived(true);
            setPage(1);
          }}
          className={`flex-grow py-2 text-xs font-bold rounded-lg transition-all duration-200 ${showArchived
            ? 'bg-card text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Archived Tasks
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 bg-card/20 border border-border/60 p-4 rounded-2xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 rounded-xl bg-background/50 focus:bg-background border-border"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="rounded-xl bg-background/50 border-border">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">All Statuses</SelectItem>
            <SelectItem value="pending" className="rounded-lg">Pending</SelectItem>
            <SelectItem value="in-progress" className="rounded-lg">In Progress</SelectItem>
            <SelectItem value="completed" className="rounded-lg">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={priority}
          onValueChange={(val) => {
            setPriority(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="rounded-xl bg-background/50 border-border">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">All Priorities</SelectItem>
            <SelectItem value="low" className="rounded-lg">Low</SelectItem>
            <SelectItem value="medium" className="rounded-lg">Medium</SelectItem>
            <SelectItem value="high" className="rounded-lg">High</SelectItem>
          </SelectContent>
        </Select>
        {/* Sort */}
        <Select
          value={sort}
          onValueChange={(val) => {
            setSort(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="rounded-xl bg-background/50 border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="newest" className="rounded-lg">Newest First</SelectItem>
            <SelectItem value="oldest" className="rounded-lg">Oldest First</SelectItem>
            <SelectItem value="dueDate" className="rounded-lg">Due Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Grid View */}
      {error ? (
        <ErrorMessage message={error} />
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      ) : tasksData && tasksData.tasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tasks found"
          description="It looks like you don't have any tasks matching your filters. Try clearing search or status filters, or add a new task."
          action={
            <Button onClick={handleOpenCreateModal} variant="outline" className="rounded-xl">
              Create New Task
            </Button>
          }
        />
      ) : (
        tasksData && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tasksData.tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {tasksData.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-6">
                <span className="text-xs text-muted-foreground">
                  Showing page {tasksData.currentPage} of {tasksData.totalPages} ({tasksData.totalTasks} total tasks)
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={tasksData.currentPage === 1}
                    onClick={() => handlePageChange(tasksData.currentPage - 1)}
                    className="rounded-xl px-3"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={tasksData.currentPage === tasksData.totalPages}
                    onClick={() => handlePageChange(tasksData.currentPage + 1)}
                    className="rounded-xl px-3"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Task form modal wrapper */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </motion.div>
  );
};

export default TasksPage;
