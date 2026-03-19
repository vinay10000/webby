import { useState, useEffect, useCallback, useRef } from 'react';
import { LocalStorageManager } from '@/lib/utils/localStorage';

interface UseSplitPaneReturn {
  ratio: number;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Custom hook for managing split pane state and interactions
 * Handles split ratio persistence, mouse drag events, and real-time resizing
 * 
 * @param defaultRatio - Default split ratio (0-1), defaults to 0.5
 * @returns Split pane state and event handlers
 */
export function useSplitPane(defaultRatio: number = 0.5): UseSplitPaneReturn {
  const [ratio, setRatio] = useState<number>(() => {
    // Load saved ratio from localStorage on mount
    return LocalStorageManager.loadSplitRatio();
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const newRatio = e.clientX / window.innerWidth;
      // Clamp ratio between 0.2 and 0.8 for usability
      const clampedRatio = Math.max(0.2, Math.min(0.8, newRatio));
      setRatio(clampedRatio);
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Save ratio to localStorage when drag ends
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    setRatio((currentRatio) => {
      LocalStorageManager.saveSplitRatio(currentRatio);
      return currentRatio;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Set up and clean up mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    ratio,
    isDragging,
    handleMouseDown,
  };
}
