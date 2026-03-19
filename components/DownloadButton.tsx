'use client';

import { EditorContent, EditorMode } from '@/types';
import { constructDocument } from '@/lib/utils/document';

interface DownloadButtonProps {
  content: EditorContent;
  mode: EditorMode;
}

export function DownloadButton({ content, mode }: DownloadButtonProps) {
  const handleDownload = () => {
    // Generate HTML file using constructDocument utility
    const htmlContent = constructDocument(
      content.html,
      content.css,
      content.javascript,
      mode
    );

    // Create blob and trigger browser download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Use filename format "snippet-[timestamp].html"
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `snippet-${timestamp}.html`;

    // Create temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
      aria-label="Download snippet as HTML file"
    >
      Download
    </button>
  );
}
