import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PreviewPane } from '@/components/PreviewPane';

// Mock the useDebounce hook to avoid waiting in tests
vi.mock('@/lib/hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value
}));

describe('PreviewPane', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render an iframe with sandbox attribute', () => {
    render(
      <PreviewPane
        html="<h1>Test</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts');
  });

  it('should NOT include allow-same-origin in sandbox attribute', () => {
    render(
      <PreviewPane
        html="<h1>Test</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview');
    const sandboxAttr = iframe.getAttribute('sandbox');
    expect(sandboxAttr).not.toContain('allow-same-origin');
  });

  it('should NOT include allow-forms in sandbox attribute', () => {
    render(
      <PreviewPane
        html="<h1>Test</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview');
    const sandboxAttr = iframe.getAttribute('sandbox');
    expect(sandboxAttr).not.toContain('allow-forms');
  });

  it('should NOT include allow-popups in sandbox attribute', () => {
    render(
      <PreviewPane
        html="<h1>Test</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview');
    const sandboxAttr = iframe.getAttribute('sandbox');
    expect(sandboxAttr).not.toContain('allow-popups');
  });

  it('should NOT include allow-top-navigation in sandbox attribute', () => {
    render(
      <PreviewPane
        html="<h1>Test</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview');
    const sandboxAttr = iframe.getAttribute('sandbox');
    expect(sandboxAttr).not.toContain('allow-top-navigation');
  });

  it('should render HTML content in single-file mode', () => {
    const html = '<h1>Hello World</h1>';
    render(
      <PreviewPane
        html={html}
        css=""
        javascript=""
        mode="single"
      />
    );

    const iframe = screen.getByTitle('Preview') as HTMLIFrameElement;
    expect(iframe.getAttribute('srcdoc')).toBe(html);
  });

  it('should combine HTML, CSS, and JavaScript in multi-file mode', () => {
    const html = '<h1>Hello</h1>';
    const css = 'h1 { color: red; }';
    const javascript = 'console.log("test");';

    render(
      <PreviewPane
        html={html}
        css={css}
        javascript={javascript}
        mode="multi"
      />
    );

    const iframe = screen.getByTitle('Preview') as HTMLIFrameElement;
    const srcdoc = iframe.getAttribute('srcdoc');

    expect(srcdoc).toContain(html);
    expect(srcdoc).toContain(css);
    expect(srcdoc).toContain(javascript);
    expect(srcdoc).toContain('<!DOCTYPE html>');
    expect(srcdoc).toContain('<style>');
    expect(srcdoc).toContain('<script>');
  });

  it('should update srcdoc when content changes', () => {
    const { rerender } = render(
      <PreviewPane
        html="<h1>Initial</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    let iframe = screen.getByTitle('Preview') as HTMLIFrameElement;
    expect(iframe.getAttribute('srcdoc')).toBe('<h1>Initial</h1>');

    rerender(
      <PreviewPane
        html="<h1>Updated</h1>"
        css=""
        javascript=""
        mode="single"
      />
    );

    // Since we mocked useDebounce to return immediately, the update should be synchronous
    iframe = screen.getByTitle('Preview') as HTMLIFrameElement;
    expect(iframe.getAttribute('srcdoc')).toBe('<h1>Updated</h1>');
  });
});
