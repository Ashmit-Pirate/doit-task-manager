import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Award } from 'lucide-react';

interface ProgressBarProps {
  rate: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ rate }) => {
  return (
    <Card className="overflow-hidden border border-border bg-card/40 backdrop-blur-sm shadow-sm mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Completion Rate</h3>
              <p className="text-xs text-muted-foreground">
                Percentage of completed tasks relative to all active items
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <Progress value={rate} className="h-3 bg-muted rounded-full" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold tracking-tight text-primary">
                {rate}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressBar;
