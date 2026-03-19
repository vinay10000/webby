import { EditorMode, Theme } from '@/types';

interface LocalDraft {
  html: string;
  css: string;
  javascript: string;
  mode: EditorMode;
  timestamp: number;
}

/**
 * Manages localStorage operations for the HTML Playground
 * Handles draft persistence, theme preferences, and split pane ratios
 */
export class LocalStorageManager {
  private static DRAFT_KEY = 'html-playground-draft';
  private static THEME_KEY = 'html-playground-theme';
  private static SPLIT_RATIO_KEY = 'html-playground-split-ratio';

  /**
   * Checks if localStorage is available
   * @returns true if localStorage is available, false otherwise
   */
  private static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Saves a draft to localStorage
   * @param draft - The draft content to save (without timestamp)
   */
  static saveDraft(draft: Omit<LocalDraft, 'timestamp'>): void {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available. Draft will not be saved.');
      return;
    }

    try {
      const data: LocalDraft = { ...draft, timestamp: Date.now() };
      localStorage.setItem(this.DRAFT_KEY, JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Unable to save draft.');
      } else {
        console.error('Failed to save draft to localStorage:', error);
      }
    }
  }

  /**
   * Loads a draft from localStorage
   * @returns The saved draft or null if not found
   */
  static loadDraft(): LocalDraft | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const data = localStorage.getItem(this.DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
      return null;
    }
  }

  /**
   * Clears the draft from localStorage
   */
  static clearDraft(): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(this.DRAFT_KEY);
    } catch (error) {
      console.error('Failed to clear draft from localStorage:', error);
    }
  }

  /**
   * Saves theme preference to localStorage
   * @param theme - The theme to save ('dark' or 'light')
   */
  static saveTheme(theme: Theme): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Loads theme preference from localStorage
   * @returns The saved theme or 'dark' as default
   */
  static loadTheme(): Theme {
    if (!this.isAvailable()) {
      return 'dark';
    }

    try {
      const theme = localStorage.getItem(this.THEME_KEY);
      return (theme === 'light' || theme === 'dark') ? theme : 'dark';
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
      return 'dark';
    }
  }

  /**
   * Saves split pane ratio to localStorage
   * @param ratio - The split ratio to save (0-1)
   */
  static saveSplitRatio(ratio: number): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      localStorage.setItem(this.SPLIT_RATIO_KEY, ratio.toString());
    } catch (error) {
      console.error('Failed to save split ratio to localStorage:', error);
    }
  }

  /**
   * Loads split pane ratio from localStorage
   * @returns The saved ratio or 0.5 as default
   */
  static loadSplitRatio(): number {
    if (!this.isAvailable()) {
      return 0.5;
    }

    try {
      const saved = localStorage.getItem(this.SPLIT_RATIO_KEY);
      return saved ? parseFloat(saved) : 0.5;
    } catch (error) {
      console.error('Failed to load split ratio from localStorage:', error);
      return 0.5;
    }
  }
}
