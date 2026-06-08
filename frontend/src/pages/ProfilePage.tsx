import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { useDashboard } from '../hooks/useDashboard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Calendar, 
  Lock, 
  Loader2, 
  BarChart2, 
  Award,
  CheckCircle,
  PlusSquare
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordSchemaType = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const { stats, isLoading: isDashboardLoading } = useDashboard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordSchemaType) => {
  try {
    await api.put('/auth/update-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    toast.success('Password updated successfully!');
    reset();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update password.';
    toast.error(message);
  }
};

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          User Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and view your task statistics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Profile Card */}
        <Card className="border border-border bg-card/40 backdrop-blur-sm shadow-sm md:col-span-1">
          <CardHeader className="flex flex-col items-center border-b border-border/50 bg-muted/5 py-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-3xl font-extrabold shadow-sm mb-4">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <CardTitle className="text-xl font-bold">{user?.name}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Workspaces Member
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-muted-foreground">Email</p>
                <p className="text-xs text-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Account Created</p>
                <p className="text-xs text-foreground">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Statistics & Change Password */}
        <div className="md:col-span-2 space-y-6">
          {/* Statistics Grid */}
          <Card className="border border-border bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isDashboardLoading ? (
                <div className="grid grid-cols-3 gap-4 animate-pulse">
                  <div className="h-20 bg-muted/40 rounded-xl" />
                  <div className="h-20 bg-muted/40 rounded-xl" />
                  <div className="h-20 bg-muted/40 rounded-xl" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {/* Created */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                    <PlusSquare className="h-5 w-5 text-blue-500 mb-2" />
                    <span className="text-lg font-bold text-foreground">
                      {stats?.total || 0}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                      Created
                    </span>
                  </div>
                  
                  {/* Completed */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
                    <span className="text-lg font-bold text-foreground">
                      {stats?.completed || 0}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                      Completed
                    </span>
                  </div>

                  {/* Rate */}
                  <div className="flex flex-col items-center p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <Award className="h-5 w-5 text-indigo-500 mb-2" />
                    <span className="text-lg font-bold text-foreground">
                      {stats.total > 0 
                        ? Math.round((stats.completed / stats.total) * 100) 
                        : 0}%
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                      Rate
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card className="border border-border bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="px-6 py-4 border-b border-border/50 bg-muted/5">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Current Password */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                      className="rounded-xl border-border bg-background/50 focus:bg-background"
                      {...register('currentPassword')}
                    />
                    {errors.currentPassword && (
                      <p className="text-xs font-medium text-destructive">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Min 6 characters"
                      className="rounded-xl border-border bg-background/50 focus:bg-background"
                      {...register('newPassword')}
                    />
                    {errors.newPassword && (
                      <p className="text-xs font-medium text-destructive">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Re-enter new password"
                      className="rounded-xl border-border bg-background/50 focus:bg-background"
                      {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs font-medium text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl font-semibold text-xs shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
