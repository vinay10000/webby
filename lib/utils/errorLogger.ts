/**
 * Logs an error to the console with context information
 * @param operation - The operation that failed (e.g., "Save snippet", "Load draft")
 * @param error - The error object or message
 * @param context - Optional additional context information
 */
export function logError(
  operation: string,
  error: Error | string,
  context?: any
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[HTML Playground] ${operation} failed:`, {
    error: errorMessage,
    stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
