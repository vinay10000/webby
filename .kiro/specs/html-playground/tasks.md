# Implementation Plan: HTML Playground

## Overview

This implementation plan builds a Next.js 14+ application with Monaco editor integration, sandboxed preview rendering, and Supabase persistence. The approach follows incremental development: infrastructure setup, core utilities, UI components, API routes, integration, and deployment. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Initialize Next.js project and install dependencies
  - Create Next.js 14+ app with App Router and TypeScript
  - Install dependencies: @monaco-editor/react, @supabase/supabase-js, tailwindcss, fast-check, vitest, @testing-library/react
  - Configure TypeScript with strict mode
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Set up Supabase database and authentication
  - [x] 2.1 Create Supabase table with schema
    - Create snippets table with id, html, css, javascript, mode, created_at columns
    - Add payload_size_check constraint (≤512000 bytes)
    - Create index on created_at column
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 2.2 Configure Row Level Security policies
    - Enable RLS on snippets table
    - Create policy for public SELECT access
    - Create policy for public INSERT access
    - Verify no UPDATE or DELETE policies exist
    - _Requirements: 5.6_

- [x] 3. Configure environment variables and Supabase client
  - Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Create lib/supabase/client.ts with createClient configuration
  - Add environment variable validation
  - _Requirements: 4.1_

- [x] 4. Create TypeScript types and interfaces
  - Create types/index.ts with EditorMode, EditorLanguage, Theme, Snippet, EditorContent, AppState types
  - Define SnippetPayload, CreateSnippetRequest, CreateSnippetResponse, ErrorResponse interfaces
  - Export all types for use across application
  - _Requirements: 4.3, 13.1_

- [x] 5. Implement core utility functions
  - [x] 5.1 Create validation utilities
    - Implement validatePayloadSize function (500KB limit)
    - Implement validateFileUpload function (extension and size checks)
    - Implement validateSnippetId function (UUID v4 format)
    - _Requirements: 4.4, 4.5, 7.3, 7.8_
  
  - [ ]* 5.2 Write property test for payload size validation
    - **Property 10: Payload size limit enforcement**
    - **Validates: Requirements 4.4, 4.5**
  
  - [x] 5.3 Create serialization utilities
    - Implement serializeSnippet function (object to JSON)
    - Implement deserializeSnippet function (JSON to object)
    - Handle special character escaping/unescaping
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ]* 5.4 Write property test for serialization round-trip
    - **Property 30: Serialization round-trip**
    - **Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.6**
  
  - [x] 5.5 Create localStorage manager
    - Implement LocalStorageManager class with saveDraft, loadDraft, clearDraft methods
    - Implement saveTheme, loadTheme methods
    - Implement saveSplitRatio, loadSplitRatio methods
    - Handle QuotaExceededError and unavailable localStorage
    - _Requirements: 6.1, 6.2, 6.3, 10.6, 9.4_
  
  - [ ]* 5.6 Write property test for localStorage draft persistence
    - **Property 13: localStorage draft round-trip**
    - **Validates: Requirements 6.2, 6.3**
  
  - [x] 5.7 Create document construction utility
    - Implement constructDocument function for multi-file mode
    - Combine HTML, CSS, JavaScript into single document
    - Return raw HTML for single-file mode
    - _Requirements: 3.6_
  
  - [ ]* 5.8 Write property test for multi-file document construction
    - **Property 6: Multi-file document construction**
    - **Validates: Requirements 3.6**
  
  - [x] 5.9 Create error logging utility
    - Implement logError function with operation, error, context parameters
    - Log to console.error with timestamp and stack trace
    - _Requirements: 11.5_

- [x] 6. Configure Tailwind CSS and global styles
  - Update tailwind.config.ts with dark mode class strategy
  - Create app/globals.css with base styles and theme variables
  - Add Monaco editor container styles
  - _Requirements: 10.2, 10.5_

- [x] 7. Implement custom React hooks
  - [x] 7.1 Create useDebounce hook
    - Implement debounce logic with configurable delay
    - Return debounced value
    - _Requirements: 2.1, 12.5_
  
  - [x] 7.2 Create useCodeState hook
    - Manage EditorContent state (html, css, javascript)
    - Manage mode and activeTab state
    - Implement auto-save to localStorage with 1-second debounce
    - Load draft from localStorage on mount
    - _Requirements: 1.4, 3.5, 6.1, 6.2, 6.3_
  
  - [ ]* 7.3 Write unit tests for useCodeState hook
    - Test state updates and localStorage integration
    - Test draft loading on mount
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 7.4 Create useTheme hook
    - Manage theme state (dark/light)
    - Load theme from localStorage on mount
    - Save theme to localStorage on change
    - Apply theme class to document root
    - _Requirements: 10.1, 10.3, 10.5, 10.6, 10.7_
  
  - [ ]* 7.5 Write property test for theme persistence
    - **Property 28: Theme localStorage persistence**
    - **Validates: Requirements 10.6, 10.7**

- [x] 8. Create ErrorBoundary component
  - Implement React error boundary with componentDidCatch
  - Display user-friendly error message
  - Log errors to console
  - Provide reset button to recover
  - _Requirements: 11.1, 11.5_

- [x] 9. Implement CodeEditor component with Monaco integration
  - [x] 9.1 Create CodeEditor component wrapper
    - Wrap @monaco-editor/react Editor component
    - Accept value, language, onChange, theme props
    - Configure Monaco options (line numbers, minimap, folding)
    - Handle editor mount and loading states
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 9.2 Write property test for editor content updates
    - **Property 1: Editor content updates in real-time**
    - **Validates: Requirements 1.4**
  
  - [ ]* 9.3 Write unit tests for CodeEditor component
    - Test rendering with different languages
    - Test onChange callback
    - Test theme application
    - _Requirements: 1.1, 10.4_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement EditorPanel component
  - [x] 11.1 Create TabBar component
    - Display tabs for HTML, CSS, JavaScript in multi-file mode
    - Handle tab switching with activeTab state
    - Apply active tab styling
    - _Requirements: 3.2, 3.3_
  
  - [x] 11.2 Create ModeToggle component
    - Toggle between single-file and multi-file modes
    - Preserve content when switching modes
    - _Requirements: 3.1, 3.5_
  
  - [ ]* 11.3 Write property test for mode switching
    - **Property 5: Mode switching preserves content**
    - **Validates: Requirements 3.5**
  
  - [x] 11.4 Create FileUploadButton component
    - Render file input with accept attribute (.html, .htm, .css, .js)
    - Handle file selection and drag-drop events
    - Validate file type and size
    - Read file content and populate editor
    - Switch to multi-file mode for CSS/JS files
    - Display error messages for invalid files
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_
  
  - [ ]* 11.5 Write property test for file extension validation
    - **Property 16: File extension validation**
    - **Validates: Requirements 7.3**
  
  - [ ]* 11.6 Write property test for file size limit enforcement
    - **Property 19: File size limit enforcement for uploads**
    - **Validates: Requirements 7.8**
  
  - [ ]* 11.7 Write unit tests for file upload
    - Test HTML file upload populates editor
    - Test CSS/JS file upload switches to multi-file mode
    - Test error handling for invalid files
    - _Requirements: 7.4, 7.5, 7.6, 7.8_
  
  - [x] 11.8 Integrate TabBar, ModeToggle, FileUploadButton, and CodeEditor
    - Compose EditorPanel with all sub-components
    - Wire up state management and event handlers
    - _Requirements: 1.1, 3.1, 3.2, 3.3, 7.1_

- [x] 12. Implement PreviewPane component
  - [x] 12.1 Create PreviewPane component with sandboxed iframe
    - Accept html, css, javascript, mode props
    - Implement 500ms debounce for preview updates
    - Construct document using constructDocument utility
    - Render iframe with sandbox="allow-scripts" attribute
    - Verify no allow-same-origin, allow-forms, allow-popups, allow-top-navigation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 12.5_
  
  - [ ]* 12.2 Write property test for iframe sandbox configuration
    - **Property 2: Preview iframe sandbox configuration**
    - **Validates: Requirements 2.2, 2.3, 2.4**
  
  - [ ]* 12.3 Write property test for preview error isolation
    - **Property 3: Preview error isolation**
    - **Validates: Requirements 2.5**
  
  - [ ]* 12.4 Write property test for single-file mode inline content
    - **Property 4: Single-file mode accepts inline styles and scripts**
    - **Validates: Requirements 3.4**
  
  - [ ]* 12.5 Write unit tests for PreviewPane
    - Test preview updates with debounce
    - Test single-file vs multi-file rendering
    - Test error handling
    - _Requirements: 2.1, 2.5, 3.4_

- [x] 13. Implement SplitPane layout component
  - [x] 13.1 Create useSplitPane hook
    - Manage split ratio state
    - Load ratio from localStorage on mount
    - Save ratio to localStorage on change
    - Handle mouse drag events for resizing
    - _Requirements: 9.2, 9.3, 9.4_
  
  - [ ]* 13.2 Write property test for split ratio persistence
    - **Property 24: Split ratio localStorage persistence**
    - **Validates: Requirements 9.4**
  
  - [x] 13.3 Create SplitPane component
    - Render left and right panes with configurable ratio
    - Render draggable divider between panes
    - Apply ratio to pane widths using CSS
    - Handle mobile layout (stack vertically below 768px)
    - _Requirements: 9.1, 9.2, 9.3, 9.5_
  
  - [ ]* 13.4 Write property test for split pane resize
    - **Property 23: Split pane resize updates ratio**
    - **Validates: Requirements 9.3**
  
  - [ ]* 13.5 Write unit tests for SplitPane
    - Test drag interaction updates ratio
    - Test mobile responsive layout
    - Test localStorage persistence
    - _Requirements: 9.3, 9.4, 9.5, 12.3_

- [x] 14. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Implement POST /api/snippets API route
  - [x] 15.1 Create app/api/snippets/route.ts with POST handler
    - Parse request body as CreateSnippetRequest
    - Validate payload size using validatePayloadSize
    - Insert snippet into Supabase snippets table
    - Return CreateSnippetResponse with id and url
    - Handle errors and return ErrorResponse
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 4.6_
  
  - [ ]* 15.2 Write property test for snippet save operation
    - **Property 7: Snippet save operation persists data**
    - **Validates: Requirements 4.1**
  
  - [ ]* 15.3 Write property test for snippet ID uniqueness
    - **Property 8: Snippet ID uniqueness**
    - **Validates: Requirements 4.2**
  
  - [ ]* 15.4 Write unit tests for POST /api/snippets
    - Test successful snippet creation
    - Test payload size validation
    - Test error handling for database failures
    - _Requirements: 4.1, 4.4, 4.5, 11.3_

- [x] 16. Implement GET /api/snippets/[id] API route
  - [x] 16.1 Create app/api/snippets/[id]/route.ts with GET handler
    - Extract snippet ID from URL params
    - Validate snippet ID format using validateSnippetId
    - Query Supabase for snippet by ID
    - Return GetSnippetResponse with snippet data
    - Return 404 ErrorResponse if snippet not found
    - Handle errors and return ErrorResponse
    - _Requirements: 5.1, 5.5_
  
  - [ ]* 16.2 Write property test for snippet persistence round-trip
    - **Property 9: Snippet persistence round-trip**
    - **Validates: Requirements 4.3, 5.1, 5.2, 5.3**
  
  - [ ]* 16.3 Write unit tests for GET /api/snippets/[id]
    - Test successful snippet retrieval
    - Test 404 for non-existent snippet
    - Test error handling for invalid ID format
    - _Requirements: 5.1, 5.5, 11.2_

- [x] 17. Implement useShare hook and Toast component
  - [x] 17.1 Create useToast hook
    - Manage toast notification state (message, type, visible)
    - Implement showToast and hideToast functions
    - Auto-hide toast after 3 seconds
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 17.2 Create Toast component
    - Display toast notification with message and type
    - Support success, error, and info types
    - Animate in/out transitions
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 17.3 Create useShare hook
    - Accept editor content and mode as parameters
    - Validate payload size before sending
    - Send POST request to /api/snippets
    - Handle success: return share URL, clear localStorage draft
    - Handle errors: display error toast, retain editor content
    - _Requirements: 4.1, 4.4, 4.5, 4.6, 6.4, 11.3_
  
  - [ ]* 17.4 Write property test for share URL contains snippet ID
    - **Property 11: Share URL contains snippet ID**
    - **Validates: Requirements 4.6**
  
  - [ ]* 17.5 Write property test for successful share clears draft
    - **Property 14: Successful share clears localStorage draft**
    - **Validates: Requirements 6.4**
  
  - [ ]* 17.6 Write unit tests for useShare hook
    - Test successful share operation
    - Test payload size validation
    - Test error handling
    - Test localStorage draft clearing
    - _Requirements: 4.6, 6.4, 11.3_

- [x] 18. Implement Header component with actions
  - [x] 18.1 Create ShareButton component
    - Trigger useShare hook on click
    - Display loading state during save
    - Display share URL in modal or copy to clipboard
    - Show success/error toast
    - _Requirements: 4.1, 4.6_
  
  - [x] 18.2 Create DownloadButton component
    - Generate HTML file using constructDocument utility
    - Create blob and trigger browser download
    - Use filename format "snippet-[timestamp].html"
    - Handle single-file vs multi-file mode
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 18.3 Write property test for download in single-file mode
    - **Property 20: Download in single-file mode preserves content**
    - **Validates: Requirements 8.2**
  
  - [ ]* 18.4 Write property test for download in multi-file mode
    - **Property 21: Download in multi-file mode combines content**
    - **Validates: Requirements 8.3, 8.5**
  
  - [ ]* 18.5 Write property test for download filename format
    - **Property 22: Download filename format**
    - **Validates: Requirements 8.4**
  
  - [x] 18.6 Create ThemeToggle component
    - Use useTheme hook for state management
    - Toggle between dark and light themes on click
    - Display sun/moon icon based on current theme
    - _Requirements: 10.1, 10.3_
  
  - [ ]* 18.7 Write property test for theme toggle
    - **Property 25: Theme toggle switches themes**
    - **Validates: Requirements 10.3**
  
  - [ ]* 18.8 Write property test for theme applies to Monaco
    - **Property 26: Theme applies to Monaco editor**
    - **Validates: Requirements 10.4**
  
  - [ ]* 18.9 Write property test for theme applies to UI
    - **Property 27: Theme applies to application UI**
    - **Validates: Requirements 10.5**
  
  - [x] 18.10 Integrate ShareButton, DownloadButton, and ThemeToggle into Header
    - Compose Header component with all action buttons
    - Apply responsive layout for mobile
    - _Requirements: 4.1, 8.1, 10.1_

- [x] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 20. Implement main page (app/page.tsx)
  - [x] 20.1 Create app/page.tsx with client component
    - Initialize useCodeState hook for editor state
    - Initialize useTheme hook for theme management
    - Render Header with ShareButton, DownloadButton, ThemeToggle
    - Render SplitPane with EditorPanel and PreviewPane
    - Wrap in ErrorBoundary
    - _Requirements: 1.1, 2.1, 3.1, 9.1, 12.1_
  
  - [ ]* 20.2 Write integration tests for main page
    - Test full editor-to-preview flow
    - Test theme switching affects all components
    - Test mode switching preserves content
    - _Requirements: 1.4, 2.1, 3.5, 10.3_

- [x] 21. Implement snippet view page
  - [x] 21.1 Create app/view/[id]/page.tsx server component
    - Extract snippet ID from params
    - Fetch snippet from Supabase using GET /api/snippets/[id]
    - Pass snippet data to ViewClient component
    - Handle 404 for non-existent snippets
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 21.2 Create ViewClient component
    - Accept snippet data as props
    - Initialize editor state with snippet content
    - Render same UI as main page (Header, SplitPane, EditorPanel, PreviewPane)
    - Allow editing of loaded snippet
    - _Requirements: 5.2, 5.3, 5.4, 5.6_
  
  - [ ]* 21.3 Write property test for preview renders loaded snippet
    - **Property 12: Preview renders loaded snippet**
    - **Validates: Requirements 5.4**
  
  - [ ]* 21.4 Write unit tests for snippet view page
    - Test snippet loading and rendering
    - Test 404 handling
    - Test editing loaded snippet
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 22. Create error pages
  - Create app/not-found.tsx with 404 message
  - Create app/error.tsx with error boundary UI
  - _Requirements: 5.5, 11.1, 11.2_

- [x] 23. Implement mobile responsive layout
  - [x] 23.1 Update SplitPane for mobile breakpoint
    - Stack editor and preview vertically below 768px
    - Add toggle button to switch between editor and preview views
    - Hide inactive view on mobile
    - _Requirements: 9.5, 9.6_
  
  - [x] 23.2 Update Header for mobile layout
    - Stack action buttons vertically or use overflow menu
    - Ensure touch-friendly button sizes
    - _Requirements: 9.5_
  
  - [ ]* 23.3 Write unit tests for mobile responsive layout
    - Test viewport width triggers layout changes
    - Test mobile toggle functionality
    - _Requirements: 9.5, 9.6_

- [x] 24. Performance optimization and final testing
  - [x] 24.1 Verify debounce implementation
    - Confirm preview updates debounced to 500ms
    - Confirm localStorage saves debounced to 1 second
    - _Requirements: 2.1, 6.1, 12.5_
  
  - [x] 24.2 Verify performance requirements
    - Test application load time (≤2 seconds)
    - Test tab switching performance (≤100ms)
    - Test split pane resize performance (≤16ms for 60fps)
    - Test snippet load time (≤1 second)
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 24.3 Run all property tests with 100+ iterations
    - Execute all 30 property tests
    - Verify minimum 100 iterations per test
    - Fix any failures
  
  - [ ]* 24.4 Generate test coverage report
    - Run coverage analysis with Vitest
    - Verify 80%+ line coverage for business logic
    - Verify 100% coverage for critical paths
  
  - [ ]* 24.5 Write property test for localStorage stores only most recent draft
    - **Property 15: localStorage stores only most recent draft**
    - **Validates: Requirements 6.5**
  
  - [ ]* 24.6 Write property test for error logging
    - **Property 29: Error logging to console**
    - **Validates: Requirements 11.5**

- [x] 25. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [-] 26. Deploy to Vercel
  - Create Vercel project and link repository
  - Configure environment variables in Vercel dashboard
  - Deploy to production
  - Verify all functionality works in production environment
  - Test share URLs and snippet loading
  - _Requirements: 4.1, 5.1_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- All 30 correctness properties from the design document are covered by property tests
- Implementation follows the build plan order to ensure proper dependency management
- TypeScript strict mode ensures type safety throughout the application
