'use client';

import { useCodeState, useTheme } from '@/lib/hooks';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { SplitPane } from '@/components/SplitPane';
import { EditorPanel } from '@/components/EditorPanel';
import { PreviewPane } from '@/components/PreviewPane';

export default function Home() {
  // Initialize editor state management
  const {
    content,
    setContent,
    mode,
    setMode,
    activeTab,
    setActiveTab
  } = useCodeState();

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
