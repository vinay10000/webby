'use client';

import { useEffect } from 'react';
import { logError } from '@/lib/utils/errorLogger';

/**
 * Root-level error boundary
 * Catches and displays errors with recovery options
 * 
 * Validates: Requirements 11.1, 11.2
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    logError('Application Error', error, { digest: error.digest });
  }, [error]);

  // Determine user-friendly error message based on error type
  const getErrorMessage = () => {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('database') || errorMessage.includes('supabase') || errorMessage.includes('connection')) {
      return {
        title: 'Unable to connect to database',
        description: 'The database service is currently unavailable. You can continue editing locally, and your work will be auto-saved in your browser.'
      };
    }
    
    if (errorMessage.includes('snippet') || errorMessage.includes('load')) {
      return {
        title: 'Failed to load snippet',
        description: error.message
      };
    }
    
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. You can try resetting the application or check the console for more details.'
    };
  };

  const { title, description } = getErrorMessage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>
        
        {error.message && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
            {error.message}
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors text-center"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
