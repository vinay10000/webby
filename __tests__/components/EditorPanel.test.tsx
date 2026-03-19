import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorPanel } from '@/components/EditorPanel';
import { EditorContent } from '@/types';

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}));

describe('EditorPanel', () => {
  const mockContent: EditorContent = {
    html: '<h1>Test</h1>',
    css: 'body { margin: 0; }',
    javascript: 'console.log("test");'
  };

  const defaultProps = {
    content: mockContent,
    mode: 'single' as const,
    activeTab: 'html' as const,
    theme: 'dark' as const,
    onContentChange: vi.fn(),
    onModeChange: vi.fn(),
    onActiveTabChange: vi.fn()
  };

  it('should render mode toggle', () => {
    render(<EditorPanel {...defaultProps} />);
    expect(screen.getByText('Single File')).toBeInTheDocument();
  });

  it('should render file upload button', () => {
    render(<EditorPanel {...defaultProps} />);
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('should not show tabs in single-file mode', () => {
    render(<EditorPanel {...defaultProps} />);
    expect(screen.queryByText('HTML')).not.toBeInTheDocument();
    expect(screen.queryByText('CSS')).not.toBeInTheDocument();
    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
  });

  it('should show tabs in multi-file mode', () => {
    render(<EditorPanel {...defaultProps} mode="multi" />);
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should call onModeChange when mode toggle is clicked', () => {
    const onModeChange = vi.fn();
    render(<EditorPanel {...defaultProps} onModeChange={onModeChange} />);
    
    fireEvent.click(screen.getByText('Single File'));
    expect(onModeChange).toHaveBeenCalledWith('multi');
  });

  it('should call onActiveTabChange when tab is clicked in multi-file mode', () => {
    const onActiveTabChange = vi.fn();
    render(<EditorPanel {...defaultProps} mode="multi" onActiveTabChange={onActiveTabChange} />);
    
    fireEvent.click(screen.getByText('CSS'));
    expect(onActiveTabChange).toHaveBeenCalledWith('css');
  });

  it('should display HTML content in single-file mode', () => {
    render(<EditorPanel {...defaultProps} />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveValue('<h1>Test</h1>');
  });

  it('should display active tab content in multi-file mode', () => {
    render(<EditorPanel {...defaultProps} mode="multi" activeTab="css" />);
    const editor = screen.getByTestId('monaco-editor');
    expect(editor).toHaveValue('body { margin: 0; }');
  });

  it('should call onContentChange when editor content changes in single-file mode', () => {
    const onContentChange = vi.fn();
    render(<EditorPanel {...defaultProps} onContentChange={onContentChange} />);
    
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, { target: { value: '<h1>New</h1>' } });
    
    expect(onContentChange).toHaveBeenCalledWith({
      ...mockContent,
      html: '<h1>New</h1>'
    });
  });

  it('should call onContentChange when editor content changes in multi-file mode', () => {
    const onContentChange = vi.fn();
    render(<EditorPanel {...defaultProps} mode="multi" activeTab="css" onContentChange={onContentChange} />);
    
    const editor = screen.getByTestId('monaco-editor');
    fireEvent.change(editor, { target: { value: 'body { padding: 0; }' } });
    
    expect(onContentChange).toHaveBeenCalledWith({
      ...mockContent,
      css: 'body { padding: 0; }'
    });
  });
});
