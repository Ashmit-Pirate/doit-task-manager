import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ClipboardList, Clock, Zap, CheckCircle2 } from 'lucide-react';
import type { DashboardStats } from '../../types/api';
import { useNavigate } from 'react-router-dom';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const navigate = useNavigate();

  const items = [
    {
      title: 'TOTAL TASKS',
      value: stats.total,
      icon: ClipboardList,
      colorClass: 'text-purple-500',
      valueColorClass: 'text-foreground',
      borderClass: 'border-l-purple-500',
      path: '/tasks',
    },
    {
      title: 'PENDING',
      value: stats.pending,
      icon: Clock,
      colorClass: 'text-amber-500',
      valueColorClass: 'text-amber-500',
      borderClass: 'border-l-amber-500',
      path: '/tasks?status=pending',
    },
    {
      title: 'IN PROGRESS',
      value: stats.inProgress,
      icon: Zap,
      colorClass: 'text-blue-500',
      valueColorClass: 'text-blue-500',
      borderClass: 'border-l-blue-500',
      path: '/tasks?status=in-progress',
    },
    {
      title: 'COMPLETED',
      value: stats.completed,
      icon: CheckCircle2,
      colorClass: 'text-emerald-500',
      valueColorClass: 'text-emerald-500',
      borderClass: 'border-l-emerald-500',
      path: '/tasks?status=completed',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {items.map((item) => (
        <Card
          key={item.title}
          onClick={() => navigate(item.path)}
          className={`overflow-hidden border border-border border-l-4 ${item.borderClass} bg-card/45 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
        >
          <CardContent className="p-5 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {item.title}
              </span>
              <item.icon className={`h-5 w-5 opacity-90 ${item.colorClass}`} />
            </div>
            <div className="mt-4">
              <span className={`text-3xl font-extrabold tracking-tight ${item.valueColorClass}`}>
                {item.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;