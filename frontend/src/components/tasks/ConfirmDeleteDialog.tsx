import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  taskTitle?: string;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  taskTitle = 'this task',
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-[24px] p-8 border border-border/80 bg-card/90 backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center text-center gap-3">
          {/* Circular Trash Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 mb-2">
            <Trash2 className="h-7 w-7" />
          </div>
          
          {/* Title */}
          <DialogTitle className="text-2xl font-extrabold text-foreground">
            Delete Task?
          </DialogTitle>
          
          {/* Subtitle / Description */}
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            This action cannot be undone. The task will be permanently removed.
          </DialogDescription>
        </DialogHeader>

        {/* Task Title Capsule Container */}
        <div className="mt-5 mb-6 w-full py-3.5 px-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
          <span className="text-sm font-semibold text-primary break-words block">
            {taskTitle}
          </span>
        </div>

        {/* Action Buttons Stack (Vertical) */}
        <div className="flex flex-col gap-3 w-full">
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-6 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/10 transition-all duration-200"
          >
            {isDeleting ? 'Deleting Task...' : 'Delete Task'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-6 rounded-xl font-semibold text-sm text-muted-foreground hover:text-foreground hover:bg-transparent transition-all duration-200"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
