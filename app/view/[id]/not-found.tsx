import Link from 'next/link';

/**
 * Custom 404 page for snippet view route
 * Displayed when a snippet ID doesn't exist
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Snippet Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          The snippet you're looking for doesn't exist or may have been deleted.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Go to Playground
        </Link>
      </div>
    </div>
  );
}
