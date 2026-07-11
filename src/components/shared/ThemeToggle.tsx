'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Laptop } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-1 bg-secondary p-1 rounded-full border border-border">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'light'
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          theme === 'system'
            ? 'bg-background text-primary shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System Preference"
        aria-label="System Preference"
      >
        <Laptop className="h-4 w-4" />
      </button>
    </div>
  );
}
