import React, { useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsCards from '../components/dashboard/StatsCards';
import TaskOverviewSection from '../components/dashboard/TaskOverviewSection';
import StatsCardSkeleton from '../components/shared/StatsCardSkeleton';
import ErrorMessage from '../components/shared/ErrorMessage';
import TaskModal from '../components/tasks/TaskModal';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
  const { stats, dueSoonTasks, overdueTasks, isLoading, error } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardHeader onAddTaskClick={handleOpenModal} />
        <ErrorMessage message={error} />
        <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
    >
      <DashboardHeader onAddTaskClick={handleOpenModal} />

      {isLoading ? (
        <div className="space-y-8">
          {/* Stats Skeletons */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
          
          {/* Progress Skeleton */}
          <div className="h-24 w-full bg-card/20 border border-border animate-pulse rounded-2xl" />

          {/* Overview List Skeletons */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64 bg-card/20 border border-border animate-pulse rounded-2xl" />
            <div className="h-64 bg-card/20 border border-border animate-pulse rounded-2xl" />
          </div>
        </div>
      ) : (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} />

          

            {/* Overdue and Due Soon Sections */}
            <div className="grid gap-6 md:grid-cols-2">
              <TaskOverviewSection 
                title="Overdue" 
                tasks={overdueTasks} 
                variant="overdue"
              />
              <TaskOverviewSection 
                title="Due Soon" 
                tasks={dueSoonTasks}
                variant="due-soon" 
              />
            </div>
          </>
        
      )}

      {/* Task Creation Modal */}
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </motion.div>
  );
};

export default DashboardPage;
