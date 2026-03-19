'use client';

import React, { useState } from 'react';
import { EditorContent, EditorLanguage, EditorMode, Theme } from '@/types';
import { CodeEditor } from './CodeEditor';
import { TabBar } from './TabBar';
import { ModeToggle } from './ModeToggle';
import { FileUploadButton } from './FileUploadButton';

interface EditorPanelProps {
  content: EditorContent;
  mode: EditorMode;
  activeTab: EditorLanguage;
  theme: Theme;
  onContentChange: (content: EditorContent) => void;
  onModeChange: (mode: EditorMode) => void;
  onActiveTabChange: (tab: EditorLanguage) => void;
}

/**
 * EditorPanel component that integrates TabBar, ModeToggle, FileUploadButton, and CodeEditor
 */
export function EditorPanel({
  content,
  mode,
  activeTab,
  theme,
  onContentChange,
  onModeChange,
  onActiveTabChange
}: EditorPanelProps) {
  const [error, setError] = useState<string | null>(null);

  const handleEditorChange = (value: string) => {
    if (mode === 'single') {
      onContentChange({ ...content, html: value });
    } else {
      onContentChange({ ...content, [activeTab]: value });
    }
  };

  const handleFileUpload = (fileContent: string, type: EditorLanguage) => {
    onContentChange({ ...content, [type]: fileContent });
    if (type !== 'html') {
      onActiveTabChange(type);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    // Auto-clear error after 3 seconds
    setTimeout(() => setError(null), 3000);
  };

  const getCurrentEditorValue = () => {
    if (mode === 'single') {
      return content.html;
    }
    return content[activeTab];
  };

  const getCurrentLanguage = (): EditorLanguage => {
    if (mode === 'single') {
      return 'html';
    }
    return activeTab;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls bar */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
        <div className="px-4 py-2">
          <FileUploadButton
            onFileUpload={handleFileUpload}
            onModeChange={onModeChange}
            onError={handleError}
          />
        </div>
      </div>

      {/* Tab bar (only in multi-file mode) */}
      {mode === 'multi' && (
        <TabBar activeTab={activeTab} onTabChange={onActiveTabChange} />
      )}

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm border-b border-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={getCurrentEditorValue()}
          language={getCurrentLanguage()}
          onChange={handleEditorChange}
          theme={theme}
        />
      </div>
    </div>
  );
}
