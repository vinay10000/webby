'use client';

import { EditorContent, EditorMode } from '@/types';
import { ShareButton } from './ShareButton';
import { DownloadButton } from './DownloadButton';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  content: EditorContent;
  mode: EditorMode;
  onShareSuccess?: (url: string) => void;
  onShareError?: (error: string) => void;
}

export function Header({ content, mode, onShareSuccess, onShareError }: HeaderProps) {
  return (
    <header className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-bold text-white">HTML Playground</h1>
          
          {/* Action buttons with touch-friendly sizing on mobile */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="min-h-[44px] flex items-center">
              <ShareButton
                content={content}
                mode={mode}
                onSuccess={onShareSuccess}
                onError={onShareError}
              />
            </div>
            <div className="min-h-[44px] flex items-center">
              <DownloadButton content={content} mode={mode} />
            </div>
            <div className="min-h-[44px] flex items-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
