'use client';

import { useState } from 'react';
import { GetSnippetResponse, EditorContent, EditorMode, EditorLanguage } from '@/types';
import { useTheme } from '@/lib/hooks';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { SplitPane } from '@/components/SplitPane';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPane } from '@/components/PreviewPane';

interface ViewClientProps {
  snippet: GetSnippetResponse;
}

/**
 * Client component for viewing and editing shared snippets
 * Initializes editor state with snippet data instead of localStorage
 */
export function ViewClient({ snippet }: ViewClientProps) {
  // Initialize state with snippet data
  const [content, setContent] = useState<EditorContent>({
    html: snippet.html,
    css: snippet.css,
    javascript: snippet.javascript
  });
  const [mode, setMode] = useState<EditorMode>(snippet.mode);
  const [activeTab, setActiveTab] = useState<EditorLanguage>('html');

  // Initialize theme management
  const { theme } = useTheme();

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header with action buttons */}
        <Header
          content={content}
          mode={mode}
        />

        {/* Main content area with split pane layout */}
        <div className="flex-1 overflow-hidden">
          <SplitPane
            left={
              <EditorPanel
                content={content}
                mode={mode}
                activeTab={activeTab}
                theme={theme}
                onContentChange={setContent}
                onModeChange={setMode}
                onActiveTabChange={setActiveTab}
              />
            }
            right={
              <PreviewPane
                html={content.html}
                css={content.css}
                javascript={content.javascript}
                mode={mode}
              />
            }
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
