import { EditorMode } from '@/types';

/**
 * Constructs an HTML document from separate HTML, CSS, and JavaScript content
 * @param html - The HTML content
 * @param css - The CSS content
 * @param javascript - The JavaScript content
 * @param mode - The editor mode ('single' or 'multi')
 * @returns Complete HTML document string
 */
export function constructDocument(
  html: string,
  css: string,
  javascript: string,
  mode: EditorMode
): string {
  // In single-file mode, return raw HTML as-is
  if (mode === 'single') {
    return html;
  }

  // In multi-file mode, combine HTML, CSS, and JavaScript into a single document
  return `<!DOCTYPE html>
<html>
  <head>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>${javascript}</script>
  </body>
</html>`;
}
