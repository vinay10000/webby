import { useEffect, useState } from 'react';
import { Theme } from '@/types';
import { LocalStorageManager } from '@/lib/utils/localStorage';

/**
 * Custom hook for managing theme state with localStorage persistence
 * @returns Current theme and setter function
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = LocalStorageManager.loadTheme();
    setThemeState(savedTheme);
    
    // Apply theme class to document root
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  // Set theme and persist to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    LocalStorageManager.saveTheme(newTheme);
    
    // Apply theme class to document root
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(newTheme);
    }
  };

  return {
    theme,
    setTheme
  };
}
