'use client';

import React from 'react';
import { EditorMode } from '@/types';

interface ModeToggleProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

/**
 * ModeToggle component for switching between single-file and multi-file modes
 */
export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const handleToggle = () => {
    onModeChange(mode === 'single' ? 'multi' : 'single');
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
      <button
        onClick={handleToggle}
        className="px-3 py-1 text-sm font-medium rounded transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
      >
        {mode === 'single' ? 'Single File' : 'Multi File'}
      </button>
    </div>
  );
}
