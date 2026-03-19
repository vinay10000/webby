import { useEffect, useState } from 'react';
import { EditorContent, EditorLanguage, EditorMode } from '@/types';
import { LocalStorageManager } from '@/lib/utils/localStorage';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing editor code state with localStorage persistence
 * @returns Editor state and setter functions
 */
export function useCodeState() {
  const [content, setContent] = useState<EditorContent>({
    html: '',
    css: '',
    javascript: ''
  });
  const [mode, setMode] = useState<EditorMode>('single');
  const [activeTab, setActiveTab] = useState<EditorLanguage>('html');

  // Debounce content and mode for auto-save (1 second delay)
  const debouncedContent = useDebounce(content, 1000);
  const debouncedMode = useDebounce(mode, 1000);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = LocalStorageManager.loadDraft();
    if (draft) {
      setContent({
        html: draft.html,
        css: draft.css,
        javascript: draft.javascript
      });
      setMode(draft.mode);
    }
  }, []);

  // Auto-save to localStorage with 1-second debounce
  useEffect(() => {
    LocalStorageManager.saveDraft({
      html: debouncedContent.html,
      css: debouncedContent.css,
      javascript: debouncedContent.javascript,
      mode: debouncedMode
    });
  }, [debouncedContent, debouncedMode]);

  return {
    content,
    setContent,
    mode,
    setMode,
    activeTab,
    setActiveTab
  };
}
