import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 transition-all duration-300 hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 transition-all duration-300 hover:rotate-45" />
      )}
    </Button>
  );
};

export default ThemeToggle;
