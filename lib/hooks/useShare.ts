import { useState, useCallback } from 'react';
import { EditorMode, EditorContent, CreateSnippetResponse, ErrorResponse } from '@/types';
import { validatePayloadSize } from '@/lib/utils/validation';
import { LocalStorageManager } from '@/lib/utils/localStorage';

interface UseShareOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useShare(options?: UseShareOptions) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const share = useCallback(
    async (content: EditorContent, mode: EditorMode): Promise<string | null> => {
      setIsSharing(true);
      setError(null);
      setShareUrl(null);

      try {
        // Validate payload size before sending
        const payload = {
          html: content.html,
          css: content.css,
          javascript: content.javascript,
          mode,
        };

        if (!validatePayloadSize(payload)) {
          const errorMessage = 'Snippet size exceeds 500KB limit. Please reduce content.';
          setError(errorMessage);
          options?.onError?.(errorMessage);
          return null;
        }

        // Send POST request to /api/snippets
        const response = await fetch('/api/snippets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          const errorMessage = errorData.error || 'Failed to save snippet';
          setError(errorMessage);
          options?.onError?.(errorMessage);
          return null;
        }

        // Handle success: return share URL, clear localStorage draft
        const data: CreateSnippetResponse = await response.json();
        setShareUrl(data.url);
        
        // Clear localStorage draft on successful share
        LocalStorageManager.clearDraft();
        
        options?.onSuccess?.(data.url);
        return data.url;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save snippet';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return null;
      } finally {
        setIsSharing(false);
      }
    },
    [options]
  );

  return {
    share,
    isSharing,
    shareUrl,
    error,
  };
}
