import { SnippetPayload } from '@/types';

/**
 * Validates that a snippet payload does not exceed the 500KB size limit
 * @param payload - The snippet payload to validate
 * @returns true if payload is within size limit, false otherwise
 */
export function validatePayloadSize(payload: SnippetPayload): boolean {
  const totalSize =
    new Blob([payload.html]).size +
    new Blob([payload.css]).size +
    new Blob([payload.javascript]).size;

  return totalSize <= 500 * 1024; // 500KB
}

/**
 * Validates a file upload for extension and size
 * @param file - The file to validate
 * @returns Object with valid boolean and optional error message
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.html', '.htm', '.css', '.js'];
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!validExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file type. Please upload .html, .htm, .css, or .js files' };
  }

  if (file.size > 500 * 1024) {
    return { valid: false, error: 'File size exceeds 500KB limit' };
  }

  return { valid: true };
}

/**
 * Validates that a string is a valid UUID v4 format
 * @param id - The snippet ID to validate
 * @returns true if ID is valid UUID v4, false otherwise
 */
export function validateSnippetId(id: string): boolean {
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
