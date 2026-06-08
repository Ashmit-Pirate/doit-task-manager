import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/tasks')) return 'Tasks';
    if (path.startsWith('/profile')) return 'Profile';
    return 'DoIT';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans">

      {/* Desktop Sidebar — collapsible on hover */}
      <motion.div
        className="hidden md:block h-full flex-shrink-0 relative z-40"
        animate={{ width: sidebarExpanded ? 240 : 64 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => {
          setTimeout(() => setSidebarExpanded(false), 280);
        }}
      >
        <Sidebar isExpanded={sidebarExpanded} />
      </motion.div>

      {/* Mobile Sidebar Overlay/Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 md:hidden"
            >
              <div className="relative h-full w-full">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
                <Sidebar
                  isExpanded={true}
                  onCloseMobile={() => setMobileSidebarOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right Column — Navbar + Main Content */}
      <div className="flex flex-grow flex-col h-full min-w-0 overflow-hidden">
        <Navbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          title={getPageTitle()}
        />
        <main className="flex-grow overflow-y-auto px-6 py-6 md:px-8 bg-background">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AppLayout;