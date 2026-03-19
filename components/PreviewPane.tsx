'use client';

import { useEffect, useState } from 'react';
import { EditorMode } from '@/types';
import { constructDocument } from '@/lib/utils/document';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface PreviewPaneProps {
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
}

/**
 * PreviewPane component that renders user code in a sandboxed iframe
 * Implements 500ms debounce for preview updates to prevent excessive re-renders
 * 
 * Security: Uses sandbox="allow-scripts" to isolate user code execution
 * - No allow-same-origin: Prevents access to parent window
 * - No allow-forms: Prevents form submission
 * - No allow-popups: Prevents popup windows
 * - No allow-top-navigation: Prevents navigation of top-level window
 */
export function PreviewPane({ html, css, javascript, mode }: PreviewPaneProps) {
  const [srcdoc, setSrcdoc] = useState('');

  // Debounce the content to prevent excessive iframe updates
  const debouncedHtml = useDebounce(html, 500);
  const debouncedCss = useDebounce(css, 500);
  const debouncedJavascript = useDebounce(javascript, 500);
  const debouncedMode = useDebounce(mode, 500);

  useEffect(() => {
    // Construct the document using the utility function
    const document = constructDocument(
      debouncedHtml,
      debouncedCss,
      debouncedJavascript,
      debouncedMode
    );
    setSrcdoc(document);
  }, [debouncedHtml, debouncedCss, debouncedJavascript, debouncedMode]);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900">
      <iframe
        sandbox="allow-scripts"
        srcDoc={srcdoc}
        className="w-full h-full border-0"
        title="Preview"
      />
    </div>
  );
}
