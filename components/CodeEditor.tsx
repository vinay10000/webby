'use client';

import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { EditorLanguage, Theme } from '@/types';

interface CodeEditorProps {
  value: string;
  language: EditorLanguage;
  onChange: (value: string) => void;
  theme: Theme;
}

/**
 * Monaco-based code editor component with syntax highlighting and IntelliSense
 */
export function CodeEditor({ value, language, onChange, theme }: CodeEditorProps) {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Configure editor options after mount if needed
    editor.focus();
  };

  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleEditorChange}
      onMount={handleEditorMount}
      theme={monacoTheme}
      options={{
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        folding: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        tabSize: 2,
        insertSpaces: true,
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
          <div className="text-gray-600 dark:text-gray-400">Loading editor...</div>
        </div>
      }
    />
  );
}
