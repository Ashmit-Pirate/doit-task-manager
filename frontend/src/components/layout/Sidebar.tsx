import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  CheckSquare,
  LayoutDashboard,
  CheckCircle2,
  User,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface SidebarProps {
  isExpanded?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded = false,
  onCloseMobile,
}) => {
  const { logout, user } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckCircle2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="flex flex-col h-full bg-card border-r border-border text-card-foreground overflow-hidden">

      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 py-6 border-b border-border/50 transition-all duration-300",
        isExpanded ? "px-6" : "px-3"
      )}>
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 flex-shrink-0">
          <CheckSquare className="h-6 w-6" />
        </div>
        <span className={cn(
          "font-heading font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent whitespace-nowrap overflow-hidden transition-all duration-200",
          isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
        )}>
          DoIT
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                "flex items-center py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-muted/80",
                isExpanded ? "px-4 gap-3" : "px-3",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap overflow-hidden transition-all duration-200",
              isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
            )}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className={cn(
        "border-t border-border/50 space-y-2 transition-all duration-200",
        isExpanded ? "p-4" : "p-2"
      )}>

        {/* User Card */}
        <div className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "opacity-100 max-h-20 mb-2" : "opacity-0 max-h-0"
        )}>
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/40">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/15 text-primary font-semibold text-sm flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 py-2 px-3 text-muted-foreground hover:text-foreground rounded-xl transition-colors justify-start"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 flex-shrink-0" />
          ) : (
            <Sun className="h-5 w-5 flex-shrink-0" />
          )}
          <span className={cn(
            "whitespace-nowrap overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
          )}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors justify-start"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className={cn(
            "text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
          )}>
            Logout
          </span>
        </Button>

      </div>
    </aside>
  );
};

export default Sidebar;