// Core domain types
export type EditorMode = 'single' | 'multi';
export type EditorLanguage = 'html' | 'css' | 'javascript';
export type Theme = 'dark' | 'light';

// Snippet interface
export interface Snippet {
  id: string;
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
  created_at: string;
}

// Editor content interface
export interface EditorContent {
  html: string;
  css: string;
  javascript: string;
}

// Application state interface
export interface AppState {
  content: EditorContent;
  mode: EditorMode;
  activeTab: EditorLanguage;
  theme: Theme;
  splitRatio: number;
  isLoading: boolean;
  error: string | null;
  shareUrl: string | null;
}

// Serialization types
export interface SnippetPayload {
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
}

export interface SerializedSnippet {
  id: string;
  payload: string; // JSON stringified SnippetPayload
  created_at: string;
}

// API request/response interfaces
export interface CreateSnippetRequest {
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
}

export interface CreateSnippetResponse {
  id: string;
  url: string;
}

export interface GetSnippetResponse {
  id: string;
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
  created_at: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
