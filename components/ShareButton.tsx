'use client';

import { useState } from 'react';
import { EditorContent, EditorMode } from '@/types';
import { useShare } from '@/lib/hooks/useShare';

interface ShareButtonProps {
  content: EditorContent;
  mode: EditorMode;
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function ShareButton({ content, mode, onSuccess, onError }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  const { share, isSharing, shareUrl } = useShare({
    onSuccess: (url) => {
      setShowModal(true);
      onSuccess?.(url);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const handleShare = async () => {
    await share(content, mode);
  };

  const handleCopyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCopiedToClipboard(false);
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        aria-label="Share snippet"
      >
        {isSharing ? 'Sharing...' : 'Share'}
      </button>

      {showModal && shareUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Snippet Shared Successfully!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your snippet is now available at:
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4 break-all">
              <code className="text-sm text-gray-900 dark:text-gray-100">{shareUrl}</code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
