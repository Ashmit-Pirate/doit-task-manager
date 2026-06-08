import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import ThemeToggle from '../shared/ThemeToggle';
import { Button } from '../ui/button';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar, title }) => {
  const { user } = useAuthContext();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/50 bg-card/80 px-6 backdrop-blur-md">
      {/* Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="md:hidden"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px]">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {user && (
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <span className="hidden text-sm font-medium text-muted-foreground md:block">
              {user.name}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
