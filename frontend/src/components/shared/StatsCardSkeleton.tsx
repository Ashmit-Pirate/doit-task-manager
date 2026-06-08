import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const StatsCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden border border-border border-l-4 border-l-muted bg-card/30 backdrop-blur-sm shadow-sm">
      <CardContent className="p-5 flex flex-col justify-between min-h-[110px]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-12 rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCardSkeleton;