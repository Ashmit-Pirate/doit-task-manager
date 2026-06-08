import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16 dark:bg-[#0B0F19] overflow-hidden relative">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center z-10"
      >
        <div className="flex items-center justify-center p-5 rounded-full bg-primary/10 text-primary w-20 h-20 mx-auto mb-6 border border-primary/20 shadow-inner">
          <FileQuestion className="h-10 w-10 animate-bounce" />
        </div>
        <h2 className="text-7xl font-extrabold tracking-tight text-primary">
          404
        </h2>
        <h3 className="text-2xl font-bold text-foreground mt-4 mb-2">
          Page Not Found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-xl px-5 py-5 font-semibold text-sm shadow-md">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-xl px-5 py-5 font-semibold text-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
