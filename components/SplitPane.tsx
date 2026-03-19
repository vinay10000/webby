'use client';

import { useState } from 'react';
import { useSplitPane } from '@/lib/hooks/useSplitPane';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
}

type MobileView = 'editor' | 'preview';

/**
 * SplitPane component provides a resizable layout with draggable divider
 * Displays editor on left and preview on right with configurable ratio
 * Stacks vertically on mobile (below 768px) with toggle to switch views
 * 
 * @param left - Content for the left pane (typically editor)
 * @param right - Content for the right pane (typically preview)
 * @param defaultRatio - Default split ratio (0-1), defaults to 0.5
 */
export function SplitPane({ left, right, defaultRatio = 0.5 }: SplitPaneProps) {
  const { ratio, isDragging, handleMouseDown } = useSplitPane(defaultRatio);
  const [mobileView, setMobileView] = useState<MobileView>('editor');

  return (
    <>
      {/* Desktop layout: side-by-side with draggable divider */}
      <div className="hidden md:flex h-full w-full relative">
        {/* Left pane */}
        <div
          className="h-full overflow-hidden"
          style={{ width: `${ratio * 100}%` }}
        >
          {left}
        </div>

        {/* Draggable divider */}
        <div
          className={`
            w-1 h-full bg-gray-300 dark:bg-gray-700 
            hover:bg-blue-500 dark:hover:bg-blue-400
            cursor-col-resize flex-shrink-0
            transition-colors duration-150
            ${isDragging ? 'bg-blue-500 dark:bg-blue-400' : ''}
          `}
          onMouseDown={handleMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize split pane"
        />

        {/* Right pane */}
        <div
          className="h-full overflow-hidden flex-1"
          style={{ width: `${(1 - ratio) * 100}%` }}
        >
          {right}
        </div>
      </div>

      {/* Mobile layout: toggle between editor and preview */}
      <div className="md:hidden flex flex-col h-full w-full">
        {/* Mobile toggle buttons */}
        <div className="flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => setMobileView('editor')}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-colors
              ${mobileView === 'editor'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            aria-pressed={mobileView === 'editor'}
            aria-label="Show editor"
          >
            Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-colors
              ${mobileView === 'preview'
                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            aria-pressed={mobileView === 'preview'}
            aria-label="Show preview"
          >
            Preview
          </button>
        </div>

        {/* Editor view */}
        <div className={`flex-1 overflow-hidden ${mobileView === 'editor' ? 'block' : 'hidden'}`}>
          {left}
        </div>

        {/* Preview view */}
        <div className={`flex-1 overflow-hidden ${mobileView === 'preview' ? 'block' : 'hidden'}`}>
          {right}
        </div>
      </div>
    </>
  );
}
