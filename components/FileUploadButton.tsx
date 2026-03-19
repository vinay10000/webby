'use client';

import React, { useRef, useState } from 'react';
import { EditorLanguage, EditorMode } from '@/types';
import { validateFileUpload } from '@/lib/utils/validation';

interface FileUploadButtonProps {
  onFileUpload: (content: string, type: EditorLanguage) => void;
  onModeChange: (mode: EditorMode) => void;
  onError: (error: string) => void;
}

/**
 * FileUploadButton component for uploading HTML, CSS, and JavaScript files
 */
export function FileUploadButton({ onFileUpload, onModeChange, onError }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      onError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Read file content
      const content = await file.text();

      // Determine file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      const typeMap: Record<string, EditorLanguage> = {
        'html': 'html',
        'htm': 'html',
        'css': 'css',
        'js': 'javascript'
      };

      const type = typeMap[extension || ''];
      if (!type) {
        onError('Invalid file type');
        return;
      }

      // Switch to multi-file mode for CSS/JS files
      if (type === 'css' || type === 'javascript') {
        onModeChange('multi');
      }

      // Populate editor
      onFileUpload(content, type);
    } catch (error) {
      onError('Failed to read file');
      console.error('File read error:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`inline-block ${isDragging ? 'opacity-50' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,.css,.js"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <button
        onClick={handleButtonClick}
        className="px-3 py-1 text-sm font-medium rounded transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
      >
        Upload File
      </button>
    </div>
  );
}
