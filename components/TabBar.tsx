'use client';

import React from 'react';
import { EditorLanguage } from '@/types';

interface TabBarProps {
  activeTab: EditorLanguage;
  onTabChange: (tab: EditorLanguage) => void;
}

/**
 * TabBar component for switching between HTML, CSS, and JavaScript tabs in multi-file mode
 */
export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs: { id: EditorLanguage; label: string }[] = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'javascript', label: 'JavaScript' }
  ];

  return (
    <div className="flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
