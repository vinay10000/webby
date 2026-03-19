import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '@/components/ModeToggle';

describe('ModeToggle', () => {
  it('should display "Single File" when in single-file mode', () => {
    const onModeChange = vi.fn();
    render(<ModeToggle mode="single" onModeChange={onModeChange} />);
    
    expect(screen.getByText('Single File')).toBeInTheDocument();
  });

  it('should display "Multi File" when in multi-file mode', () => {
    const onModeChange = vi.fn();
    render(<ModeToggle mode="multi" onModeChange={onModeChange} />);
    
    expect(screen.getByText('Multi File')).toBeInTheDocument();
  });

  it('should call onModeChange with "multi" when clicked in single-file mode', () => {
    const onModeChange = vi.fn();
    render(<ModeToggle mode="single" onModeChange={onModeChange} />);
    
    fireEvent.click(screen.getByText('Single File'));
    expect(onModeChange).toHaveBeenCalledWith('multi');
  });

  it('should call onModeChange with "single" when clicked in multi-file mode', () => {
    const onModeChange = vi.fn();
    render(<ModeToggle mode="multi" onModeChange={onModeChange} />);
    
    fireEvent.click(screen.getByText('Multi File'));
    expect(onModeChange).toHaveBeenCalledWith('single');
  });

  it('should preserve content when toggling modes', () => {
    const onModeChange = vi.fn();
    const { rerender } = render(<ModeToggle mode="single" onModeChange={onModeChange} />);
    
    fireEvent.click(screen.getByText('Single File'));
    expect(onModeChange).toHaveBeenCalledWith('multi');
    
    // Simulate mode change
    rerender(<ModeToggle mode="multi" onModeChange={onModeChange} />);
    expect(screen.getByText('Multi File')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Multi File'));
    expect(onModeChange).toHaveBeenCalledWith('single');
  });
});
