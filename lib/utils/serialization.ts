import { SnippetPayload } from '@/types';

/**
 * Serializes a snippet object to JSON string
 * Special characters are handled by JSON.stringify
 * @param snippet - The snippet payload to serialize
 * @returns JSON string representation of the snippet
 */
export function serializeSnippet(snippet: SnippetPayload): string {
  return JSON.stringify(snippet);
}

/**
 * Deserializes a JSON string to a snippet object
 * Special characters are handled by JSON.parse
 * @param json - The JSON string to deserialize
 * @returns The snippet payload object
 * @throws Error if JSON is invalid
 */
export function deserializeSnippet(json: string): SnippetPayload {
  try {
    const parsed = JSON.parse(json);
    
    // Validate required fields
    if (typeof parsed.html !== 'string' ||
        typeof parsed.css !== 'string' ||
        typeof parsed.javascript !== 'string' ||
        (parsed.mode !== 'single' && parsed.mode !== 'multi')) {
      throw new Error('Invalid snippet data');
    }
    
    return parsed as SnippetPayload;
  } catch (error) {
    throw new Error('Invalid snippet data');
  }
}
