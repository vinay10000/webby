import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitPane } from '@/components/SplitPane';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('SplitPane', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should render left and right panes', () => {
    render(
      <SplitPane
        left={<div>Left Content</div>}
        right={<div>Right Content</div>}
      />
    );
    
    // Both desktop and mobile layouts render the content
    expect(screen.getAllByText('Left Content')).toHaveLength(2);
    expect(screen.getAllByText('Right Content')).toHaveLength(2);
  });

  it('should render draggable divider with proper attributes', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
    expect(divider).toHaveAttribute('aria-label', 'Resize split pane');
  });

  it('should apply default 50/50 split ratio', () => {
    const { container } = render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    // Find the left pane (first div with width style in desktop layout)
    const desktopLayout = container.querySelector('.hidden.md\\:flex');
    const leftPane = desktopLayout?.firstChild as HTMLElement;
    
    expect(leftPane?.style.width).toBe('50%');
  });

  it('should load split ratio from localStorage', () => {
    localStorageMock.setItem('html-playground-split-ratio', '0.6');
    
    const { container } = render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const desktopLayout = container.querySelector('.hidden.md\\:flex');
    const leftPane = desktopLayout?.firstChild as HTMLElement;
    
    expect(leftPane?.style.width).toBe('60%');
  });

  it('should handle mouse down on divider', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const divider = screen.getByRole('separator');
    fireEvent.mouseDown(divider);
    
    // Divider should have active styling
    expect(divider).toHaveClass('bg-blue-500');
  });

  it('should update ratio on mouse drag', async () => {
    vi.useFakeTimers();
    
    const { container } = render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const divider = screen.getByRole('separator');
    
    // Start dragging
    fireEvent.mouseDown(divider);
    
    // Simulate mouse move
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    fireEvent.mouseMove(document, { clientX: 300 });
    
    // Wait for requestAnimationFrame
    await vi.runAllTimersAsync();
    
    const desktopLayout = container.querySelector('.hidden.md\\:flex');
    const leftPane = desktopLayout?.firstChild as HTMLElement;
    
    // Ratio should be updated (clamped between 0.2 and 0.8)
    const width = parseFloat(leftPane?.style.width || '0');
    expect(width).toBeGreaterThanOrEqual(20);
    expect(width).toBeLessThanOrEqual(80);
    
    vi.useRealTimers();
  });

  it('should save ratio to localStorage on mouse up', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const divider = screen.getByRole('separator');
    
    // Start dragging
    fireEvent.mouseDown(divider);
    
    // Simulate mouse move
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    fireEvent.mouseMove(document, { clientX: 400 });
    
    // End dragging
    fireEvent.mouseUp(document);
    
    // Check localStorage was updated
    const savedRatio = localStorageMock.getItem('html-playground-split-ratio');
    expect(savedRatio).toBeTruthy();
  });

  it('should render mobile layout with stacked panes', () => {
    const { container } = render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    // Mobile layout should exist
    const mobileLayout = container.querySelector('.md\\:hidden');
    expect(mobileLayout).toBeInTheDocument();
    expect(mobileLayout).toHaveClass('flex-col');
  });

  it('should render mobile toggle buttons', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const editorButton = screen.getByRole('button', { name: 'Show editor' });
    const previewButton = screen.getByRole('button', { name: 'Show preview' });
    
    expect(editorButton).toBeInTheDocument();
    expect(previewButton).toBeInTheDocument();
  });

  it('should show editor view by default on mobile', () => {
    const { container } = render(
      <SplitPane
        left={<div data-testid="editor-content">Editor</div>}
        right={<div data-testid="preview-content">Preview</div>}
      />
    );
    
    const mobileLayout = container.querySelector('.md\\:hidden');
    const editorView = mobileLayout?.querySelector('[data-testid="editor-content"]')?.parentElement;
    const previewView = mobileLayout?.querySelector('[data-testid="preview-content"]')?.parentElement;
    
    expect(editorView).not.toHaveClass('hidden');
    expect(previewView).toHaveClass('hidden');
  });

  it('should toggle to preview view on mobile when preview button clicked', () => {
    const { container } = render(
      <SplitPane
        left={<div data-testid="editor-content">Editor</div>}
        right={<div data-testid="preview-content">Preview</div>}
      />
    );
    
    const previewButton = screen.getByRole('button', { name: 'Show preview' });
    fireEvent.click(previewButton);
    
    const mobileLayout = container.querySelector('.md\\:hidden');
    const editorView = mobileLayout?.querySelector('[data-testid="editor-content"]')?.parentElement;
    const previewView = mobileLayout?.querySelector('[data-testid="preview-content"]')?.parentElement;
    
    expect(editorView).toHaveClass('hidden');
    expect(previewView).not.toHaveClass('hidden');
  });

  it('should toggle back to editor view on mobile when editor button clicked', () => {
    const { container } = render(
      <SplitPane
        left={<div data-testid="editor-content">Editor</div>}
        right={<div data-testid="preview-content">Preview</div>}
      />
    );
    
    const editorButton = screen.getByRole('button', { name: 'Show editor' });
    const previewButton = screen.getByRole('button', { name: 'Show preview' });
    
    // Switch to preview
    fireEvent.click(previewButton);
    
    const mobileLayout = container.querySelector('.md\\:hidden');
    let editorView = mobileLayout?.querySelector('[data-testid="editor-content"]')?.parentElement;
    let previewView = mobileLayout?.querySelector('[data-testid="preview-content"]')?.parentElement;
    
    expect(editorView).toHaveClass('hidden');
    expect(previewView).not.toHaveClass('hidden');
    
    // Switch back to editor
    fireEvent.click(editorButton);
    
    editorView = mobileLayout?.querySelector('[data-testid="editor-content"]')?.parentElement;
    previewView = mobileLayout?.querySelector('[data-testid="preview-content"]')?.parentElement;
    
    expect(editorView).not.toHaveClass('hidden');
    expect(previewView).toHaveClass('hidden');
  });

  it('should apply active styling to selected mobile view button', () => {
    render(
      <SplitPane
        left={<div>Left</div>}
        right={<div>Right</div>}
      />
    );
    
    const editorButton = screen.getByRole('button', { name: 'Show editor' });
    const previewButton = screen.getByRole('button', { name: 'Show preview' });
    
    // Editor button should be active by default
    expect(editorButton).toHaveAttribute('aria-pressed', 'true');
    expect(previewButton).toHaveAttribute('aria-pressed', 'false');
    
    // Click preview button
    fireEvent.click(previewButton);
    
    // Preview button should now be active
    expect(editorButton).toHaveAttribute('aria-pressed', 'false');
    expect(previewButton).toHaveAttribute('aria-pressed', 'true');
  });
});
