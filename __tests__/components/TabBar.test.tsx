import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabBar } from '@/components/TabBar';

describe('TabBar', () => {
  it('should render all three tabs', () => {
    const onTabChange = vi.fn();
    render(<TabBar activeTab="html" onTabChange={onTabChange} />);
    
    expect(screen.getByText('HTML')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('should apply active styling to the active tab', () => {
    const onTabChange = vi.fn();
    render(<TabBar activeTab="css" onTabChange={onTabChange} />);
    
    const cssTab = screen.getByText('CSS');
    expect(cssTab).toHaveClass('text-blue-600');
  });

  it('should call onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<TabBar activeTab="html" onTabChange={onTabChange} />);
    
    fireEvent.click(screen.getByText('JavaScript'));
    expect(onTabChange).toHaveBeenCalledWith('javascript');
  });

  it('should handle switching between all tabs', () => {
    const onTabChange = vi.fn();
    render(<TabBar activeTab="html" onTabChange={onTabChange} />);
    
    fireEvent.click(screen.getByText('CSS'));
    expect(onTabChange).toHaveBeenCalledWith('css');
    
    fireEvent.click(screen.getByText('JavaScript'));
    expect(onTabChange).toHaveBeenCalledWith('javascript');
    
    fireEvent.click(screen.getByText('HTML'));
    expect(onTabChange).toHaveBeenCalledWith('html');
  });
});
