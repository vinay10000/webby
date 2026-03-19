import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUploadButton } from '@/components/FileUploadButton';

describe('FileUploadButton', () => {
  const mockOnFileUpload = vi.fn();
  const mockOnModeChange = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render upload button', () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    expect(screen.getByText('Upload File')).toBeInTheDocument();
  });

  it('should accept .html, .htm, .css, and .js files', () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', '.html,.htm,.css,.js');
  });

  it('should handle HTML file upload', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['<h1>Test</h1>'], 'test.html', { type: 'text/html' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith('<h1>Test</h1>', 'html');
    });
  });

  it('should switch to multi-file mode for CSS files', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['body { margin: 0; }'], 'styles.css', { type: 'text/css' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockOnModeChange).toHaveBeenCalledWith('multi');
      expect(mockOnFileUpload).toHaveBeenCalledWith('body { margin: 0; }', 'css');
    });
  });

  it('should switch to multi-file mode for JavaScript files', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['console.log("test");'], 'script.js', { type: 'text/javascript' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockOnModeChange).toHaveBeenCalledWith('multi');
      expect(mockOnFileUpload).toHaveBeenCalledWith('console.log("test");', 'javascript');
    });
  });

  it('should reject files with invalid extensions', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Invalid file type. Please upload .html, .htm, .css, or .js files');
      expect(mockOnFileUpload).not.toHaveBeenCalled();
    });
  });

  it('should reject files exceeding 500KB', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    // Create a file larger than 500KB
    const largeContent = 'x'.repeat(501 * 1024);
    const file = new File([largeContent], 'large.html', { type: 'text/html' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('File size exceeds 500KB limit');
      expect(mockOnFileUpload).not.toHaveBeenCalled();
    });
  });

  it('should handle drag and drop', async () => {
    render(
      <FileUploadButton
        onFileUpload={mockOnFileUpload}
        onModeChange={mockOnModeChange}
        onError={mockOnError}
      />
    );
    
    const button = screen.getByText('Upload File').parentElement;
    const file = new File(['<h1>Dropped</h1>'], 'dropped.html', { type: 'text/html' });
    
    const dropEvent = new Event('drop', { bubbles: true }) as any;
    dropEvent.dataTransfer = {
      files: [file],
    };
    
    fireEvent(button!, dropEvent);
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith('<h1>Dropped</h1>', 'html');
    });
  });
});
