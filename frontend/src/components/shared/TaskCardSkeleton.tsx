import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const TaskCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border border-border bg-card/30 backdrop-blur-sm shadow-sm flex flex-col h-full">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-center justify-between gap-4 mb-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 rounded mb-2" />
        <Skeleton className="h-4 w-full rounded mb-1" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-border/50 flex justify-between items-center bg-muted/10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCardSkeleton;
